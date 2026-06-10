import * as d3 from "d3";
import { cloud } from "./cloudgenerator";
/* Function to draw a word cloud
 * svg: d3 selection of an svg element
 * wordsPerGenre: Map of form {group =>  [[word, frequency], [word, frequency], ...], ...}
 * selection: d3 selection of select element
 */
export function wordcloud(svg, word_counts) {
  const width = 600;
  const height = 600;
  svg.attr("viewBox", [0, 0, width, height]);

  // group element, translated such that the origin is in the middle of the svg
  let g = svg.select('g');
  if(g.empty()) {
    g = svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  }

  // word size scale
  const size = d3.scaleLinear().range([25, 100]);
  // Use an attractive custom divergent color scale mapping the word size boundaries
  const color = d3.scaleLinear()
    .domain([25, 62.5, 100])
    .range(["#2a7e72", "#f3ecdb", "#c45839"]);

  // TODO: create the layout of the word cloud with
  // d3-cloud. The function you need has been imported for you
  // as "cloud()". Note, that the actual words will be
  // determined in the "update()"-function below.
  const layout = cloud()
    .size([width, height])
    .padding(5)
    .font("Impact")
    .fontSize(function (d) {
      return d.size;
    })
    .on("end", draw);

  function update(new_word_counts) {
    // get the 100 most frequent words 
    const words = new_word_counts.slice(0, 100);

    //adjust the domain of the word size scale
    size.domain(d3.extent(words, (d) => d[1]));

    // call the layout with the words -> layout.words(....)
    layout.words(words.map((d) => ({ text: d[0], size: size(d[1]) })));
    layout.start();
  }

  function draw(words) {
    g.selectAll("text")
      .data(words, d => d.text)
      .join(
        enter => enter.append("text")
          .style("font-size", d => d.size + "px")
          .style("font-family", "Impact")
          .style("fill", d => color(d.size))
          .attr("text-anchor", "middle")
          .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
          .text(d => d.text)
          .style("opacity", 0)
          .call(enter => enter.transition().duration(600).style("opacity", 1)),
        update => update
          .call(update => update.transition().duration(600)
            .style("font-size", d => d.size + "px")
            .style("fill", d => color(d.size))
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
          ),
        exit => exit
          .call(exit => exit.transition().duration(600).style("opacity", 0).remove())
      );
  }

  // Initial call
  update(word_counts);

  return update;
}

