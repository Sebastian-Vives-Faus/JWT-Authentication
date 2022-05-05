CREATE DATABASE jwttutorial;

-- 
    --user_id SERIAL PRIMARY KEY -- Serial autoincrements
    -- better option: uuid, https://www.postgresql.org/docs/current/functions-uuid.html
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(), --dd3b8f35-3a77-4724-af00-475eb0687c70
    user_name varchar(255) NOT NULL,
    user_email varchar(255) NOT NULL,
    user_password varchar(255) NOT NULL
);

-- Insert fake user
INSERT INTO users (user_name, user_email, user_password) VALUES ('henry', 'henry@gmail.com', 'asdasdasdqw');