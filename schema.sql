CREATE TABLE team (
  id SERIAL PRIMARY KEY,
  name VARCHAR (255)
);
CREATE TABLE player (
 id SERIAL PRIMARY KEY,
 first_name VARCHAR (255),
 last_name VARCHAR (255),
 team_id INT NOT NULL REFERENCES team (id)
);
CREATE TABLE match (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  winner_team_id INT NOT NULL REFERENCES team (id),
  loser_team_id INT NOT NULL REFERENCES team (id)
);