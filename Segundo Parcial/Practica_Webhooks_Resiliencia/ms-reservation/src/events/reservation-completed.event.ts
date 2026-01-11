export interface ReservationCompletedPayload{
    reservation_id: string;
    user_id: string;
    resource_name: string;
    reserved_at: string;  
}

export interface ReservationCompletedEvent{
    event_id:string;
    event_type: 'reservation.completed';
    timestamp: string;
    idempotency_key: string;
    payload: ReservationCompletedPayload;
}