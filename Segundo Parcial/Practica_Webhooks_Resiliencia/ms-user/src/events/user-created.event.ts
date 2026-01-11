export interface UserCreatedPayload {
  user_id: string;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export class UserCreatedEvent {
    event_id: string;
    event_type: 'user.created';
    timestamp: string;
    idempotency_key: string;
    payload: UserCreatedPayload;
}
