import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { Location, LocationProps } from '../../domain/entities/Location';
import { Coordinates } from '../../domain/valueObjects/Coordinates';
import { ObjectId } from 'mongodb';
import { getDb } from '../db';

const mapLocation = (doc: any): Location => {
  return new Location({
    _id: doc._id,
    name: doc.name,
    address: doc.address,
    latitude: doc.latitude,
    longitude: doc.longitude,
    type: doc.type || 'other',
    description: doc.description,
    amenities: doc.amenities || [],
    imageUrl: doc.imageUrl,
    aqiStationId: doc.aqiStationId,
    weatherStationId: doc.weatherStationId,
    createdAt: doc.createdAt || new Date(),
    location: doc.location,
  });
};

export class LocationRepository implements ILocationRepository {
  private collection = 'locations';

  async findWithinRadius(center: Coordinates, radiusMeters: number): Promise<Location[]> {
    const db = await getDb();
    
    // Ensure geospatial index exists
    try {
      await db.collection(this.collection).createIndex({ location: '2dsphere' });
    } catch (error) {
      // Index might already exist, ignore
    }

    const docs = await db
      .collection(this.collection)
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [[center.longitude, center.latitude], radiusMeters / 6378137],
          },
        },
      })
      .limit(50)
      .toArray();
    
    return docs.map(mapLocation);
  }

  async findById(id: string): Promise<Location | null> {
    const db = await getDb();
    let query: any;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }
    const doc = await db.collection(this.collection).findOne(query);
    return doc ? mapLocation(doc) : null;
  }

  async save(location: Location): Promise<Location> {
    const db = await getDb();
    const doc = location.toMongoDoc();
    const now = new Date();

    const updateDoc: Partial<LocationProps> = {
      name: doc.name,
      address: doc.address,
      latitude: doc.latitude,
      longitude: doc.longitude,
      type: doc.type,
      description: doc.description,
      amenities: doc.amenities,
      imageUrl: doc.imageUrl,
      aqiStationId: doc.aqiStationId,
      weatherStationId: doc.weatherStationId,
      location: doc.location,
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

    // Ensure geospatial index exists
    try {
      await db.collection(this.collection).createIndex({ location: '2dsphere' });
    } catch (error) {
      // Index might already exist, ignore
    }

    const savedId = doc._id?.toString();
    if (!savedId) {
      throw new Error('Failed to get location ID after save');
    }
    const saved = await this.findById(savedId);
    if (!saved) throw new Error('Failed to save location');
    return saved;
  }
}

