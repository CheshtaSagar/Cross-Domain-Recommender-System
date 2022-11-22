
# coding: utf-8

# ## CROSS DOMAIN RECOMMENDER SYSTEM 

# ## A) Movie Recommender System Based on Matrix Factorization

# In[1]:

import numpy as np
import pandas as pd
import warnings
import itertools
import mysql.connector as connection
import sys

# In[2]:
#reading from database and creating dataframes
try:
    mydb = connection.connect(host="localhost", database = "crossdomain",user="newuser", password="Newuser@22", port= "3306")
    #print("Connected")
    query = "SELECT * from crossdomain.movies;"
    movies = pd.read_sql(query,mydb)
    allmovies = movies
    query2 = "Select * from crossdomain.ratings;"
    user_ratings = pd.read_sql(query2,mydb)
    user_ratings = user_ratings.sort_values('userId').reset_index(drop= True)
    # print(user_ratings)
    warnings.filterwarnings('ignore')
    mydb.close() #close the connection
except Exception as e:
    mydb.close()
    print(str(e))





# In[5]:


def genre_array(str):
    return str.split('|')

movies['genre'] = movies['genres'].apply(genre_array)
del movies['genres']

movie_col = list(movies.columns)
movie_tags = movies['genre']
tag_table = [[token, idx] for idx, token in enumerate(set(itertools.chain.from_iterable(movie_tags)))]
tag_table = pd.DataFrame(tag_table)
tag_table.columns = ['Tag', 'Index']

tag_dummy = np.zeros([len(movies),len(tag_table)])


for i in range(len(movies)):
    for j in range(len(tag_table)):
        if tag_table['Tag'][j] in list(movie_tags[i]):
            tag_dummy[i, j] = 1

movies = pd.concat([movies, pd.DataFrame(tag_dummy)], 1)
movie_col.extend([string for string in tag_table['Tag']])
movies.columns = movie_col
del movies['genre']


# In[6]:


movielens = pd.merge(user_ratings, movies, on = 'movieId')



# In[7]:


#creating a matrix where rows denote user_ids and columns are movie_titles
#value inside matrix tells rating given by ith user to jth movie
movie_matrix = movielens.pivot_table(index='userId', columns= 'title', values= 'rating')
# print(movie_matrix)



# In[9]:


movie_matrix.fillna(0, inplace=True)


# In[10]:


#Normalize
matrix = movie_matrix.to_numpy()



# In[12]:


user_mean = np.mean(matrix, axis=1)
#user_mean


# In[13]:
#print(user_mean)

user_mean.reshape(-1,1)
#print(user_mean)
matrix_normalized = matrix - user_mean.reshape(-1,1)
#matrix_normalized


# In[14]:


from scipy.sparse.linalg import svds


# In[15]:


# applying SVD 
#Number of latent factors are 50
U , sigma, Vt = svds(matrix_normalized, k=50) 


# In[19]:


#converting sigma to diagonal matrix
sigma = np.diag(sigma) 


# ### Making Predictions

# In[21]:


all_user_predicted_ratings = np.dot(np.dot(U, sigma),Vt) + user_mean.reshape(-1,1)
# print(all_user_predicted_ratings)

# In[22]:

#610 users and predicted rating given by each user to each movie
#unrated movies have been rated now
col=movie_matrix.columns
preds_df = pd.DataFrame(all_user_predicted_ratings, columns=col)
# print(preds_df)

# #### Extracting genres

# In[26]:


#reading dataset
all_movies=allmovies
#print(all_movies)  



# ## B) Book Recommender System using extracted genres

# In[27]:


# Now, we have the top genres that should be recommended to the given user

books = pd.read_csv("./sql/booksummaries.txt", sep='\t', names = ['Wikipedia_ID', 'Freebase_ID', 'Title', 'Author', 'Pub_Date', 'Genre', 'Plot'])
#print(books)
books.dropna(subset= ['Genre'], inplace = True)
del books['Freebase_ID']
del books['Plot']
import ast
def getGenre(str):
    return list(ast.literal_eval(str).values())

books['Genre'] = books['Genre'].apply(getGenre)
books.reset_index(inplace = True, drop= True)
#print("here3")

# In[28]:


books = pd.DataFrame(books)
books_new = books.filter(['Title','Genre'], axis=1)



# In[29]:

#print(books_new)
from collections import Counter
from numpy import dot
from numpy.linalg import norm
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize



def findSimilarity(X_List, Y_List):
    # sw contains the list of stopwords
    sw = stopwords.words('english') 
    l1 =[];l2 =[]
  
    # remove stop words from the string
    X_set = {w for w in X_List if not w in sw} 
    Y_set = {w for w in Y_List if not w in sw}
  

    #print(X_set)
    #print(Y_set)

    # form a set containing keywords of both strings 
    rvector = X_set.union(Y_set) 

    #print(rvector)
    for w in rvector:
        if w in X_set: l1.append(1) # create a vector
        else: l1.append(0)
        if w in Y_set: l2.append(1)
        else: l2.append(0)
    c = 0

    # cosine formula 
    for i in range(len(rvector)):
            c+= l1[i]*l2[i]
    cosine = c / float((sum(l1)*sum(l2))**0.5)

    return cosine


# ## General Function for Movie and Book Recommendations

# In[34]:


#first, it recommends movies
#then, creates a list of genres of those top movie recommendations
#the, finds books of same genres(based on cosine similarity) and recommends top 20 such books

def recommend_movies_and_books(user_id):
    user_id = user_id - 1
    preds = preds_df.iloc[user_id,:].sort_values(ascending=False)

    # Recommendations if user has not rated the movie previously
    recommendations = [i for i in preds.index if movie_matrix.loc[1,i]==0]

    #Recommend only top 30 items
    final_top_30_movie_recommendations = recommendations[:30]
    #print("Movie Recommendations for given user are:\n" + '\n'.join(final_recommendations))
    
    #creating a list of genres of recommended movies
    genres=[] 
       
    for ele in final_top_30_movie_recommendations:
        genres.append(all_movies[all_movies.eq(ele).any(1)].genre.astype(str))

    
    
    unique_genres=[]

    for genre in genres:
        ele=genre.to_numpy()
        f=ele[0].split('|')
        for value in f:
            unique_genres.append(value)
    
    unique_genres = list(dict.fromkeys(unique_genres)) 
    
    
    #print("\nGenres liked by given user: " , unique_genres)
    
    
    #finding cosine similarity between the given genre subset with genres of all other books in dataset
    X_list = np.array(unique_genres)
    
    similar_books=[]
    
    for i in range(12840):
        Y_list = books_new.iloc[i].to_numpy()[1]
        cosine_of_X_Y = findSimilarity(X_list, Y_list)
        #print(cosine_of_X_Y)
        similar_books.append([books_new.iloc[i].to_numpy()[0],cosine_of_X_Y])
    
    
    df = pd.DataFrame(similar_books, columns = ['Name', 'Similarity Score'])
    top_book_recommendations = df.sort_values(by='Similarity Score',ascending=False)
    
    
    final_top_20_book_recommendations = top_book_recommendations.head(20)
    final_top_20_book_recommendations_list = final_top_20_book_recommendations['Name'].tolist()
    #print("\nBook Recommendations for the given user are: \n" ,final_top_20_book_recommendations_list)
    #print("\nMovie Recommendations for the given user are: \n" ,final_top_30_movie_recommendations)
    # print(final_top_20_book_recommendations_list)
    # print(final_top_30_movie_recommendations)

    
    for book in final_top_20_book_recommendations_list:
        print(book)

    print("booksendhere")

    for movie in final_top_30_movie_recommendations:
        print(movie)    

# In[37]:

user_id = int(sys.argv[1])
recommend_movies_and_books(user_id)

# %%
