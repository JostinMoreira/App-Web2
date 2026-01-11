import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_PUBLISHER') private readonly userClient: ClientProxy,
  ) {}

  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    const message_id = uuidv4();

    this.userClient.emit('user.create', {
      message_id,
      data: body,
    });

    console.log(`👤 PUBLISHED user.create - message_id: ${message_id}`);

    return { message: 'User creation request sent', message_id };
  }
}
