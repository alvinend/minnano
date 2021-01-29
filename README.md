# Setting up Environment

# Tech Stack

Minnano Uses

1. React for Front-End
2. Node.js and Express.js for Back-End
3. Typescript for Front-End and Back-End  Typechecking
4. MongoDB for Database
5. AWS S3 for Image Storage
6. AWS Beanstalk for Deploying

# Setting up Database

![https://www.notion.so/Setting-up-Environment-79aee552244f4fdea860ff4871d9b21a#4ffbaa6a192243eba889fcc62861eebf](https://www.notion.so/Setting-up-Environment-79aee552244f4fdea860ff4871d9b21a#4ffbaa6a192243eba889fcc62861eebf)

## What and Why

We use MongoDB for Minnano. 

MongoDB is a document database built on a scale-out architecture that has become popular with developers of all kinds who are building scalable applications using agile methodologies.

**MongoDB’s horizontal, scale-out architecture can support huge volumes of both data and traffic**.

## Setting up MongoDB

### Cloud

Use free tier of MongoDB Atlas to get started [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### Local

1. Download MongoDB Local Installer [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install MongoDB with the Installation Wizard
3. Create the Data Folders to Store our Databases
4. Setup Alias Shortcuts for Mongo and Mongodb

## Connect App to MongoDB

### For Developing (Local)

Make `.env` file and define `Mongo_URI` with value of your mongoDB URI

Example

```
MONGO_URI='mongodb+srv://example:password@example.6huo8.mongodb.net/minnanodb?retryWrites=true&w=majority'
```

### For Deploying

Set Environment variable of MONGO_URI

# Setting up AWS S3 (For Image Upload)

![https://www.notion.so/Setting-up-Environment-79aee552244f4fdea860ff4871d9b21a#ed57f6bee4044314856aadb577aaaa60](https://www.notion.so/Setting-up-Environment-79aee552244f4fdea860ff4871d9b21a#ed57f6bee4044314856aadb577aaaa60)

## Prerequisite

For Image upload, you need to have AWS account and S3 installed on it.  After that you need to set AWS CLI in your local computer

## Connect App to S3

### For Local

Set Local environment variable your bucket name

```
BUCKET_NAME: somebucket
```

AWS SDK will check your local for authentication. If you are not logged in locally set up these in local `.env`

```
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### For Deploy

If you deploy it from AWS Beanstalk (which is recommended) you only need to write  bucket name into environment variable

# Setting up Back-End and Front-End

![https://www.notion.so/Setting-up-Environment-79aee552244f4fdea860ff4871d9b21a#06a6a91404e4497fbbaa01b4820fb822](https://www.notion.so/Setting-up-Environment-79aee552244f4fdea860ff4871d9b21a#06a6a91404e4497fbbaa01b4820fb822)

## Prerequisite

1. NPM with version later than  `6.13.4` installed
2. Node with version later than  `12.14.1` installed
3. Yarn with version later than `1.21.1` installed (Optional)

## Install Back-End

1. Run `yarn`
2. Check if Install run correctly
3. Run `yarn dev:server`

## Install Front-End

1.  Change directory to `client` folder
2. Run `yarn` to install dependencies
3. Go back to root directory
4. Run `yarn dev:client`
5. Your browser should automatically run Minnano on port 3000

# Deploy

To deploy just simply run `yarn deploy` at root directory!

And it should generate file named zipped file named `minnano-prod.zip`.

Upload it to AWS Beanstalk and Done! You have now working server

# You're Set Up! Happy Hacking!