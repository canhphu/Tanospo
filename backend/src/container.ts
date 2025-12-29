import 'reflect-metadata';
import { container } from 'tsyringe';
import { IUserRepository } from './domain/repositories/IUserRepository';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { ILocationRepository } from './domain/repositories/ILocationRepository';
import { LocationRepository } from './infrastructure/repositories/LocationRepository';
import { IPostRepository } from './domain/repositories/IPostRepository';
import { PostRepository } from './infrastructure/repositories/PostRepository';
import { RegisterUser } from './application/useCases/RegisterUser';
import { GetNearbyLocations } from './application/useCases/GetNearbyLocations';
import { LoginUser } from './application/useCases/LoginUser';
import { GetProfile } from './application/useCases/GetProfile';
import { CreatePost } from './application/useCases/CreatePost';
import { GetPost } from './application/useCases/GetPost';
import { GetAllPost } from './application/useCases/GetAllPost';
import { GetUserPost } from './application/useCases/GetUserPost';
import { TogglePostLike } from './application/useCases/TogglePostLike';
import { AddComment } from './application/useCases/AddComment';
import { GetPostComment } from './application/useCases/GetPostComment';
import { JwtService } from './application/services/JwtService';
import { CreateLocation } from './application/useCases/CreateLocation';


// Register repositories
container.register<IUserRepository>('UserRepository', { useClass: UserRepository });
container.register<ILocationRepository>('LocationRepository', { useClass: LocationRepository });
container.register<IPostRepository>('PostRepository', { useClass: PostRepository });

// Register use cases
container.register(RegisterUser, { useClass: RegisterUser });
container.register(GetNearbyLocations, { useClass: GetNearbyLocations });
container.register(LoginUser, { useClass: LoginUser });
container.register(GetProfile, { useClass: GetProfile });
container.register(CreatePost, { useClass: CreatePost });
container.register(GetPost, { useClass: GetPost });
container.register(GetAllPost, { useClass: GetAllPost });
container.register(GetUserPost, { useClass: GetUserPost });
container.register(TogglePostLike, { useClass: TogglePostLike });
container.register(AddComment, { useClass: AddComment });
container.register(GetPostComment, { useClass: GetPostComment });
container.register(CreateLocation, { useClass: CreateLocation });

// Register services
container.register(JwtService, { useClass: JwtService });

export { container };