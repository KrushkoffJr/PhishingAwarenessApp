CREATE TABLE IF NOT EXISTS app_user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  role VARCHAR(20) DEFAULT 'USER',
  score INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  campaign VARCHAR(100),
  text TEXT,
  optionA TEXT,
  optionB TEXT,
  optionC TEXT,
  correctOption CHAR(1),
  explanation TEXT
);

INSERT INTO app_user (username, password, role, score)
VALUES ('demo', 'demo', 'USER', 0)
ON CONFLICT (username) DO NOTHING;

INSERT INTO questions (campaign, text, optionA, optionB, optionC, correctOption, explanation)
VALUES 
('Phishing erkennen','Du erhältst eine E-Mail: "Passwort zurücksetzen". Was tust du?','
Link anklicken','Absender prüfen & IT informieren','Ignorieren','B','
E-Mail-Adresse prüfen; nicht automatisch klicken')
ON CONFLICT DO NOTHING;h
VALUESgm
