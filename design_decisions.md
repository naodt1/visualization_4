### Design
We have visualized the cluster evolution using a **Dendrogram**. Each node represents a cluster. On hover, we can view the details about the cluster. The links between the nodes use a sequential color scale to encode the distance. Clusters that are closer to each other have a darker blue color. With larger distances, the blue color fades to a grey. We can also interact with the nodes. On selecting a node, the three charts below the dendrogram update to reflect details of the selected node.
1. **The Wordcloud**  
For the selected nodes, we can see the wordcloud for the words that commonly occur in the overview for the movies in that cluster. The font size and the color encode how common or unique the word is.
2. **The Genre chart**  
The genre chart is a bar chart the encodes the percentage of movies in the cluster that belong to a genre. Genres are categorical and each genre is assigned a specific color. The y axis is scaled according to the max percentage to make it easy to read. On hover, we an find the actual number of movie titles.
3. **The Movie List**  
The movie list display the list of movies in the selected cluster. Each movie is displayed in a card that shows the title, the genres and the overview. We can click on the card to expand or collapse it.

### Justification
replace with your answer