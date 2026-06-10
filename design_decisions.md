### Design
We have visualized the cluster evolution using a **Dendrogram**. Each node represents a cluster. On hover, we can view the details about the cluster. The vertical axis encodes the merge distance. The horizontal axis does not encode any quantitative values. The numbers on the axis are just assigned to be able to easily name the leaf node. 

The links between the nodes use a sequential color scale to encode the distance. Clusters that are closer to each other have a darker blue color. With larger distances, the blue color fades to a grey. We can also interact with the nodes. On selecting a node, the three charts below the dendrogram update to reflect details of the selected node.
> **Note:** We understand that in our dendrogram visualization, the leaf nodes are actually clusters that have been merged from other clusters in the algorithm These clusters are not actually at the same level and have eucledian distances encoded (can be seen on hover). But for our visualization we have put them all on the same level as per the requirement of the dendrogram. Hence, the endges appear much larger from the leaf nodes compared to other nodes.


**The Wordcloud**  
For the selected nodes, we can see the wordcloud for the words that commonly occur in the overview for the movies in that cluster. The font size and the color encode how common or unique the word is. We used a diverging color scale that reads from teal (very common) to teracotta (highly unique).

**The Genre Chart**  
The genre chart is a bar chart the encodes the percentage of movies in the cluster that belong to a genre. Genres are categorical and each genre is assigned a specific color. The y axis is scaled according to the max percentage to make it easy to read. On hover, we an find the actual number of movie titles. We removed the "Action" genre from the list as all movies are action movies and it would be redundant information.

**The Movie List**  
The movie list display the list of movies in the selected cluster. Each movie is displayed in a card that shows the title, the genres and the overview. We can click on the card to expand or collapse it.

### Justification
The four visualizations we chose directly answer the four research questions.

The dendrogram helps visualize hoe similar clusters are by looking at the difference in height. Similar regions appear denser. It also reveals how the clusters eveolve and are merged at every step of the algorithm.

The movie list helps answer the second question to see the list of movies in a cluster. We can quickly look at the titles and genres and click to expand the overview. This information can help understand if the movies have something in common.

The genre chart shows answers question 3 by showing the distribution the genres in each cluster. It helps to clearly see the which genres occur together in a cluster. The bar chart is good method to visualize occurance frequecies of categorical data.

The wordcloud is to answer question 4. We used the TF-IDF scoring rather than raw frequency so that generic terms which are common across most action movies are suppressed and we can see more words that are unique to the cluster.