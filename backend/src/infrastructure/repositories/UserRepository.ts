import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserProps } from '../../domain/entities/User';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';

const mapUser = (doc: any): User => {
  return new User({
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    language: doc.language || 'ja',
    avatarUrl: doc.avatarUrl,
    homeLat: doc.homeLat,
    homeLng: doc.homeLng,
    currentLat: doc.currentLat,
    currentLng: doc.currentLng,
    role: doc.role || 'user',
    createdAt: doc.createdAt || new Date(),
    updatedAt: doc.updatedAt || new Date(),
  });
};

export class UserRepository implements IUserRepository {
  private collection = 'users';

  async findByEmail(email: string): Promise<User | null> {
    const db = await getDb();
    const doc = await db.collection(this.collection).findOne({ email });
    return doc ? mapUser(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const db = await getDb();
    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }
    const doc = await db.collection(this.collection).findOne(query);
    return doc ? mapUser(doc) : null;
  }

  async save(user: User): Promise<User> {
    const db = await getDb();
    const doc = user.toMongoDoc();
    const now = new Date();
    
    const updateDoc: Partial<UserProps> = {
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      language: doc.language,
      avatarUrl: doc.avatarUrl,
      homeLat: doc.homeLat,
      homeLng: doc.homeLng,
      currentLat: doc.currentLat,
      currentLng: doc.currentLng,
      role: doc.role,
      updatedAt: now,
    };

    const result = await db.collection(this.collection).updateOne(
      { _id: doc._id },
      {
        $set: updateDoc,
        $setOnInsert: {
          createdAt: doc.createdAt || now,
        },
      },
      { upsert: true },
    );

    if (result.upsertedId) {
      doc._id = result.upsertedId as ObjectId;
    }

    const savedId = doc._id?.toString();
    if (!savedId) {
      throw new Error('Failed to get user ID after save');
    }
    const saved = await this.findById(savedId);
    if (!saved) throw new Error('Failed to save user');
    return saved;
  }

  async updateCurrentLocation(userId: string, lat: number, lng: number): Promise<void> {
    const db = await getDb();
    let query: any;
    try {
      query = { _id: new ObjectId(userId) };
    } catch {
      query = { _id: userId };
    }
    await db
      .collection(this.collection)
      .updateOne(query, { $set: { currentLat: lat, currentLng: lng, updatedAt: new Date() } });
  }
}

