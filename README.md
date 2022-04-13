ASSIGNMENT  : ( Date: 13-04-22) 
You have to replicate the below data in your database. With this in mind, create a node application and APIs to do the following:

1. Write down the schemas for book and authors (keeping the data given below in mind). Also create the documents (corresponding to the data given below) in your database.
2. CRUD operations. Write API's to do the following:
Write create APIs for both books and authors ---> If author_id is not available then do not accept the entry(in neither the author collection nor the books collection)
List out the books written by "Chetan Bhagat" ( this will need 2 DB queries one after another- first query will find the author_id for "Chetan Bhagat”. Then next query will get the list of books with that author_id )
find the author of “Two states” and update the book price to 100;  Send back the author_name and updated price in response.  ( This will also need 2  queries- 1st will be a findOneAndUpdate. The second will be a find query aith author_id from previous query)
Find the books which costs between 50-100(50,100 inclusive) and respond back with the author names of respective books.. 
bookModel.find( { price : { $gte: 50}  ,  price: {$lte: 100} } ) // WRONG
bookModel.find( { price : { $gte: 50, $lte: 100} } ).select({ author_id :1})..run a map(or forEach) loop and get all the authorName corresponding to the authorId’s ( by querying authorModel)

DATA:

// _id:ObjectId("8781263871293"), _id will be automatically generated
Authors:
    {    

        author_id:1,
        author_name:"Chetan Bhagat",
        age:25,
        address:"New delhi"
    } ,
    { 
        author_id:2,
        author_name:"J.k Rowling",
        age:60,
        address:"Britain"
    } ,
    {    
        author_id:3,
        author_name:"Ramanujan",
        age:100,
        address:"Tamilnadu"
    }



Books:
    { 
        name:"Two states",
        author_id:1,
        price:50,
        ratings:4.5,
    } ,


    { 
        name:"Five Point Someone",
        author_id:1,
        price:50,
        ratings:4.5,
    } ,
    { 
        name:"The 3 Mistakes of My Life",
        author_id:1,
        price:50,
        ratings:4.5,
    } ,
    { 
        name:"One Arranged Murder",
        author_id:1,
        price:50,
        ratings:4.5,
    } ,
    { 
        name:"Harry Porter",
        author_id:2,
        price:50,
        ratings:4.5,
    } ,
    { 
        name:"Harry Porter",
        author_id:2,
        price:50,
        ratings:4.5,
    } 


