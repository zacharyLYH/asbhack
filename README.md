# asbhack

# Steps:

1.

```
pip3 install -r backend/requirements.txt
```

2.

```
touch /backend/.env
```

3. Enter your credentials

```
LINKEDIN_EMAIL=
LINKEDIN_PASSWORD=
GEMINI_API_KEY=
```

4.

```
python3 backend/linkedin_scraper.py
```

5.
```
cd frontend && bun dev
cd backend && python3 main.py
```

