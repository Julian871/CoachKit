CREATE TABLE exercise.exercises (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    user_id UUID NOT NULL,
                                    name VARCHAR(100) NOT NULL,
                                    body_region VARCHAR(20) NOT NULL,
                                    muscle_group VARCHAR(30) NOT NULL,
                                    target_muscle VARCHAR(50),
                                    movement_pattern VARCHAR(20),
                                    description VARCHAR(500),
                                    video_url VARCHAR(255),
                                    image_url VARCHAR(255),
                                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_exercises_user_id ON exercise.exercises(user_id);
CREATE INDEX idx_exercises_user_active ON exercise.exercises(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_exercises_body_region ON exercise.exercises(user_id, body_region) WHERE is_active = TRUE;
CREATE INDEX idx_exercises_muscle_group ON exercise.exercises(user_id, muscle_group) WHERE is_active = TRUE;