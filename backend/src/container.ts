import 'reflect-metadata';
import { container } from 'tsyringe';
import { IUserRepository } from './domain/repositories/IUserRepository';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { ILocationRepository } from './domain/repositories/ILocationRepository';
import { LocationRepository } from './infrastructure/repositories/LocationRepository';
import { RegisterUser } from './application/useCases/RegisterUser';
import { GetNearbyLocations } from './application/useCases/GetNearbyLocations';
import { LoginUser } from './application/useCases/LoginUser';;
import { JwtService } from './application/services/JwtService';
// Register repositories
container.register<IUserRepository>('UserRepository', { useClass: UserRepository });
container.register<ILocationRepository>('LocationRepository', { useClass: LocationRepository });

// Register use cases
container.register(RegisterUser, { useClass: RegisterUser });
container.register(GetNearbyLocations, { useClass: GetNearbyLocations });
container.register(LoginUser, { useClass: LoginUser });

// Register services
container.register(JwtService, { useClass: JwtService });

export { container };

