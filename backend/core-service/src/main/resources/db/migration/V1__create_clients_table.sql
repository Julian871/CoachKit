CREATE TABLE client.clients (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id UUID NOT NULL,
                                name VARCHAR(100) NOT NULL,
                                email VARCHAR(255),
                                phone VARCHAR(20),
                                birth_date DATE,
                                notes TEXT,
                                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_clients_user_id ON client.clients(user_id);
CREATE INDEX idx_clients_user_active ON client.clients(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_clients_email ON client.clients(email);