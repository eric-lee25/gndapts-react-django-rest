# gndapts

## Installing it locally

1. Clone this repo

   ```
   git@github.com:dopeboy/gndapts.git
   ```

2. Create a virtual environment in the project folder (assuming you have python3 installed):
   ```
   cd gndapts
   virtualenv -p python3 venv
   ```

3. Load the virtual environment:
   ```
   source venv/bin/activate
   ```
   
4. Install all the python and node.js depedencies:

    ```
    pip3 install -r requirements.txt
    npm install
    ```

5. Setup your db (assuming you have postgres installed):

    ```
    sudo -u postgres createuser -P postgres #make password 'admin'
    sudo -u postgres createdb -O postgres mydb
    ```
    
## Running it locally

1. Start the backend server in the terminal where you ran the `source` command above:

    ```
    python src/manage.py runserver 
    ```
    
2. Start the frontend server in another terminal:

    ```
    npm run dev
    ```
    
## Development process

1. Everytime you work on a new feature, create a branch for it. 

    ```
    git pull origin master
    git checkout -b <feature_name>
    ```

2. Any code you add or change should go only on that new branch. Once you're done making changes, commit and push:

    ```
    git commit -m "<insert msg here>"
    git push origin <branch name>
    ```
    
3. Go to github and submit a pull request. Please fill out details about what you changed and how you made your changes. I will look it over and approve.
