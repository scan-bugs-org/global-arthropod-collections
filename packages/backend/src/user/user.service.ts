import { Inject, Injectable, Logger } from '@nestjs/common';
import { User, USER_PROVIDER_ID } from '../database/models/User';
import { Model } from 'mongoose';
import crypto from 'crypto';

@Injectable()
export class UserService {
    private logger: Logger;

    constructor(@Inject(USER_PROVIDER_ID) private readonly user: Model<User>) {
        this.logger = new Logger(UserService.name);
        this.createAdminUser().catch(this.logger.error.bind(this));
    }

    private async createAdminUser() {
        return new Promise<void>((async (resolve, reject) => {
            const adminUser = await this.user.findById('admin');
            if (adminUser) {
                this.logger.log('Found existing admin user');
                resolve();
            }
            else {
                crypto.randomBytes(16, async (err, bytes) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const password = bytes.toString('hex');
                        const adminUser = {
                            _id: 'admin',
                            password: password
                        };
                        await this.user.create(adminUser);
                        this.logger.warn(`Added admin user with password ${ password }`);
                        this.logger.warn('Please change the admin password');
                        resolve();
                    }
                });
            }
        }));
    }

    async login(username: string, password: string): Promise<User> {
        const user = await this.user.findById(username).exec();
        if (user && user.verifyPassword(password)) {
            return user;
        }
        return null;
    }
}
