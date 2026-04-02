CREATE TABLE template.templates (
                                   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                   user_id UUID NOT NULL,
                                   name VARCHAR(100) NOT NULL,
                                   description VARCHAR(500),
                                   is_active BOOLEAN NOT NULL DEFAULT true,
                                   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP
);

CREATE TABLE template.template_exercises (
                                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                            template_id UUID NOT NULL REFERENCES template.templates(id) ON DELETE CASCADE,
                                            exercise_id UUID NOT NULL REFERENCES exercise.exercises(id),
                                            order_index INTEGER NOT NULL,
                                            UNIQUE (template_id, exercise_id)
);

CREATE INDEX idx_templates_user_id ON template.templates(user_id);
CREATE INDEX idx_templates_active ON template.templates(is_active);
CREATE INDEX idx_template_exercises_template_id ON template.template_exercises(template_id);