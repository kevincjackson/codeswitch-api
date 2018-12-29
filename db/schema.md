# Schema Commands
Name: `codeswitch-db`

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    hash TEXT NOT NULL,
    admin BOOL DEFAULT FALSE,
    moderator BOOL DEFAULT FALSE
);

CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL  
);

CREATE TABLE languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    syntax_code VARCHAR(100) DEFAULT ""
);

CREATE TABLE code_samples (
    id SERIAL PRIMARY KEY,
    feature_id INT NOT NULL,
    language_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    source TEXT DEFAULT '',
    correctness_upvotes TEXT DEFAULT '[]',
    correctness_downvotes TEXT DEFAULT '[]',
    design_upvotes TEXT DEFAULT '[]',
    design_downvotes TEXT DEFAULT '[]',
    style_upvotes TEXT DEFAULT '[]',
    style_downvotes TEXT DEFAULT '[]'
);

```
