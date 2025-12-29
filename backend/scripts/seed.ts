/*
  Seed script to import sample data from frontend/src/lib into MongoDB.
  - Seeds Locations from locationsData.js
  - Seeds Users derived from Posts authors
  - Seeds Posts (status type), associates with Locations when possible
  - Seeds Comments by attaching to a post that matches the comment's location (best-effort)

  Run: npm run seed
*/
import 'reflect-metadata';
import path from 'path';
import fs from 'fs';
import vm from 'vm';
import bcrypt from 'bcrypt';
import { getDb, closeDb } from '../src/infrastructure/db';
import { LocationRepository } from '../src/infrastructure/repositories/LocationRepository';
import { PostRepository } from '../src/infrastructure/repositories/PostRepository';
import { UserRepository } from '../src/infrastructure/repositories/UserRepository';
import { Location } from '../src/domain/entities/Location';
import { Post } from '../src/domain/entities/Post';
import { Comment } from '../src/domain/entities/Comment';
import { env } from '../src/config/env';

const SALT_ROUNDS = 10;

type FrontendLocation = {
  id: number;
  name: string;
  distance?: string;
  address?: string;
  description?: string;
  facilities?: string[];
  sportIds?: number[];
  openTime?: string;
  rating?: number;
  lat: number;
  lng: number;
  image?: string;
};

type FrontendPost = {
  id: string;
  author: { name: string; avatar?: string; location?: string };
  content: string;
  image?: { src: string; alt?: string } | null;
  timestamp?: string;
  likes?: number;
};

type FrontendComment = {
  id: number;
  locationId: number;
  author: string;
  content: string;
  rating: number;
  date: string;
};

// Utility: strip JS comments
function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // block comments
    .replace(/(^|\s)\/\/.*$/gm, ''); // line comments
}

// Extract array literal from a JS module exporting `export const <name> = [ ... ];`
function extractArrayLiteral(moduleCode: string, exportName: string): string {
  const idx = moduleCode.indexOf(`export const ${exportName}`);
  if (idx === -1) throw new Error(`Cannot find export ${exportName}`);
  const after = moduleCode.slice(idx);
  const eqIdx = after.indexOf('=');
  if (eqIdx === -1) throw new Error(`Cannot find '=' for ${exportName}`);
  const startFromEq = after.slice(eqIdx + 1);
  // find the first '[' and match brackets until closing ']'
  const startBracketIdx = startFromEq.indexOf('[');
  if (startBracketIdx === -1) throw new Error(`Cannot find array start for ${exportName}`);
  let i = startBracketIdx;
  let depth = 0;
  while (i < startFromEq.length) {
    const ch = startFromEq[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        // include closing bracket
        const literal = startFromEq.slice(startBracketIdx, i + 1);
        return literal;
      }
    }
    i++;
  }
  throw new Error(`Failed to parse array for ${exportName}`);
}

// Evaluate array literal safely
function evalArray<T>(literal: string): T[] {
  const code = `(${literal})`;
  const context = {};
  return vm.runInNewContext(code, context) as T[];
}

async function seed() {
  console.log(`[Seed] NODE_ENV=${env.nodeEnv}, DB=${env.mongo.dbName}`);
  await getDb();

  const locationsRepo = new LocationRepository();
  const postsRepo = new PostRepository();
  const usersRepo = new UserRepository();

  const frontendLibPath = path.resolve(process.cwd(), '../frontend/src/lib');

  // Load and parse locations
  const locationsJs = fs.readFileSync(path.join(frontendLibPath, 'locationsData.js'), 'utf-8');
  const locationsArr = evalArray<FrontendLocation>(extractArrayLiteral(stripComments(locationsJs), 'locations'));
  console.log(`[Seed] Locations found: ${locationsArr.length}`);

  // Insert locations
  const locationIdMap = new Map<number, string>(); // frontend id -> db id
  for (const loc of locationsArr) {
    try {
      const now = new Date();
      const entity = new Location({
        name: loc.name,
        address: loc.address,
        latitude: loc.lat,
        longitude: loc.lng,
        type: 'other',
        description: loc.description,
        amenities: Array.isArray(loc.facilities) ? loc.facilities : [],
        imageUrl: loc.image,
        createdAt: now,
      });
      const saved = await locationsRepo.save(entity);
      locationIdMap.set(loc.id, saved.id);
    } catch (e) {
      console.warn(`[Seed] Failed to save location '${loc.name}':`, (e as Error).message);
    }
  }
  console.log(`[Seed] Locations saved: ${locationIdMap.size}`);

  // Load and parse posts (authors will be used to seed users)
  const postsJs = fs.readFileSync(path.join(frontendLibPath, 'posts.js'), 'utf-8');
  const postsArr = evalArray<FrontendPost>(extractArrayLiteral(stripComments(postsJs), 'posts'));
  console.log(`[Seed] Posts found: ${postsArr.length}`);

  // Create users from unique authors
  const authorNames = Array.from(new Set(postsArr.map(p => p.author?.name || 'User')));
  const userIdByAuthor = new Map<string, string>();
  let authorCounter = 1;

  for (const name of authorNames) {
    const safeLocalPart = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `user${authorCounter}`;
    const email = `${safeLocalPart}@example.com`;
    authorCounter++;
    try {
      const existing = await usersRepo.findByEmail(email);
      if (existing) {
        userIdByAuthor.set(name, existing.id);
        continue;
      }
      const now = new Date();
      const passwordHash = await bcrypt.hash('123456', SALT_ROUNDS);
      const user = new (await import('../src/domain/entities/User')).User({
        name,
        email,
        passwordHash,
        language: 'ja',
        role: 'user',
        createdAt: now,
        updatedAt: now,
      });
      const saved = await usersRepo.save(user);
      userIdByAuthor.set(name, saved.id);
    } catch (e) {
      console.warn(`[Seed] Failed to save user '${name}':`, (e as Error).message);
    }
  }
  console.log(`[Seed] Users saved: ${userIdByAuthor.size}`);

  // Build helper: try map post to a location by name presence
  const locationsByName = new Map<string, string>(); // name -> id
  for (const [frontendId, dbId] of locationIdMap.entries()) {
    const loc = locationsArr.find(l => l.id === frontendId);
    if (loc) locationsByName.set(loc.name, dbId);
  }

  // Insert posts
  const postIdByLocationDbId = new Map<string, string[]>();
  for (const p of postsArr) {
    try {
      const now = new Date();
      const userId = userIdByAuthor.get(p.author?.name || authorNames[0]);
      if (!userId) continue;
      // Try match location
      let locationId: string | undefined;
      if (p.author?.location) {
        for (const [name, id] of locationsByName.entries()) {
          if (p.author.location.includes(name)) {
            locationId = id;
            break;
          }
        }
      }
      if (!locationId) {
        // fallback: content match
        for (const [name, id] of locationsByName.entries()) {
          if (p.content && p.content.includes(name)) {
            locationId = id;
            break;
          }
        }
      }
      const entity = new Post({
        userId,
        postType: 'status',
        locationId,
        content: p.content,
        imageUrl: p.image?.src || undefined,
        likedBy: [],
        createdAt: p.timestamp ? new Date(p.timestamp) : now,
        updatedAt: now,
      });
      const saved = await postsRepo.save(entity);
      if (locationId) {
        const arr = postIdByLocationDbId.get(locationId) || [];
        arr.push(saved.id);
        postIdByLocationDbId.set(locationId, arr);
      }
    } catch (e) {
      console.warn(`[Seed] Failed to save post '${p.id}':`, (e as Error).message);
    }
  }
  console.log(`[Seed] Posts saved.`);

  // Load and parse comments, attach to any post for the location
  const commentsPath = path.join(frontendLibPath, 'comments.js');
  if (fs.existsSync(commentsPath)) {
    try {
      const commentsJs = fs.readFileSync(commentsPath, 'utf-8');
      const commentsArr = evalArray<FrontendComment>(extractArrayLiteral(stripComments(commentsJs), 'comments'));
      console.log(`[Seed] Comments found: ${commentsArr.length}`);
      const commenterPasswordHash = await bcrypt.hash('123456', SALT_ROUNDS);
      const commenterEmail = 'commenter@example.com';
      let commenterUser = await usersRepo.findByEmail(commenterEmail);
      if (!commenterUser) {
        const now = new Date();
        const UserCtor = (await import('../src/domain/entities/User')).User;
        commenterUser = await usersRepo.save(new UserCtor({
          name: 'Commenter',
          email: commenterEmail,
          passwordHash: commenterPasswordHash,
          language: 'ja',
          role: 'user',
          createdAt: now,
          updatedAt: now,
        }));
      }

      for (const c of commentsArr) {
        try {
          const locDbId = locationIdMap.get(c.locationId);
          if (!locDbId) continue;
          const postsForLoc = postIdByLocationDbId.get(locDbId) || [];
          const targetPostId = postsForLoc[0];
          if (!targetPostId) continue;
          const commentEntity = new Comment({
            postId: targetPostId,
            userId: commenterUser.id,
            content: c.content,
            rating: c.rating,
            createdAt: new Date(c.date),
          });
          await postsRepo.addComment(commentEntity);
        } catch (e) {
          console.warn(`[Seed] Failed to add comment ${c.id}:`, (e as Error).message);
        }
      }
      console.log('[Seed] Comments saved.');
    } catch (e) {
      console.warn('[Seed] Comments import failed:', (e as Error).message);
    }
  } else {
    console.log('[Seed] comments.js not found; skipping comments.');
  }

  await closeDb();
  console.log('[Seed] Done.');
}

seed().catch(async (err) => {
  console.error('[Seed] Error:', err);
  await closeDb();
  process.exit(1);
});
