CREATE SCHEMA api;

CREATE TABLE api.releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specification JSONB
);

create role web_anon nologin;

grant usage on schema api to web_anon;
grant select on api.releases to web_anon;

create role authenticator noinherit login password 'web_anonsecretpassword';
grant web_anon to authenticator;

INSERT INTO api.releases (id, specification) VALUES
('56b07c4a-4302-4cbc-8f28-3c8e956f4d3e', '{"type":"small","requests":{"cpu":"0.5","memory":"512Mi"},"limits":{"cpu":"1","memory":"1Gi"}}'),
('c0f8b2d3-4a5e-4c9b-8f3e-6d7c8e9f0a1b', '{"type":"custom","requests":{"cpu":"2","memory":"4Gi"},"limits":{"cpu":"4","memory":"8Gi"}}');
