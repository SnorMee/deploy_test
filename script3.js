let canvas = d3.select('#canvas')


 
let drawTreeMap = (data) => {
    canvas.selectAll('*').remove();
    let hierarchy = d3.hierarchy(data, (node)=>{
        return node['children'];
    }).sum((node) =>{
        return node['value'];
    }).sort((node1,node2) =>{
        return node2['value'] - node1['value'];
    })

    let createTreeMap = d3.treemap()
                            .size([1000, 600])

    createTreeMap(hierarchy)

    
    let threatLeaves = hierarchy.leaves()
    //console.log(threatLeaves)

    let block = canvas.selectAll('g')
            .data(threatLeaves)
            .enter()
            .append('g')
            .attr('transform', (tree) => {
                return 'translate(' + tree['x0'] + ', ' + tree['y0'] + ')'
            })
    block.append('rect')
            //.attr('class', 'tile')
            .attr('fill', (tree) => {
                let category = tree['data']['name'].split('.')[0]
                if(category === '1'){
                    return '#ff6b6b'
                }else if(category === '2'){
                    return '#f06595'
                }else if(category === '3'){
                    return '#cc5de8'
                }else if(category === '4'){
                    return '#845ef7'
                }else if(category === '5'){
                    return '#5c7cfa'
                }else if(category === '6'){
                    return '#339af0'
                }else if(category === '7'){
                    return '#22b8cf'
                }else if(category === '8'){
                    return '#20c997'
                }else if(category === '9'){
                    return '#51cf66'
                }else if(category === '10'){
                    return '#94d82d'
                }else if(category === '11'){
                    return '#fcc419'
                }else if(category === '12'){
                    return '#ff922b'
                }
            }).attr('data-name', (tree) => {
                return tree['data']['name']
            }).attr('data-category',(tree) => {
                return tree['data']['name'].split('.')[0]
            }).attr('data-spLen', (tree) => {
                return tree['data']['num']
            }).attr('width', (tree) => {
                return tree['x1'] - tree['x0']
            }).attr('height', (tree) => {
                return tree['y1'] - tree['y0']
            })
            .on('mouseover', function (event, d) {
                tooltip.style('opacity', 1);
                tooltip.html("<strong>" + d.data.category + "</strong><br>" +
                "Number of species affected: " + d.data.value + "<br>" +
                "Number of threats: " + d.data.numT + "<br>" +
                "Species affected:" + d.data.species) //Add more information here
                  .style('left', (event.pageX + 10) + 'px')
                  .style('top', (event.pageY + 10) + 'px');
              })
              .on('mouseout', function () {
                tooltip.style('opacity', 0);
              });

    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip');

    block.append('text')
            .text((tree) => {
                return tree['data']['name'];
            })
            .attr('x', 5)
            .attr('y', 20)
    block.append('text')
        .text((tree) => {
            return  tree['data']['category']
        })
        .attr('x', 5)
        .attr('y', 40);
};

////////////////////////////////////////////////////////////////////// LOAD DATA //////////////////////////////////////////////////////////

var data = null;

$.ajax({
    url: "data/Threat_nest_List.json",
    contentType:"application/json; charset=utf-8",
    dataType: 'json',
    async: false,

    success: function(response){
        dataThreatTotal = response
    }
});

$.ajax({
    url: "data/Threat_Title_ALL_IUCN.json",
    contentType:"application/json; charset=utf-8",
    dataType: 'json',
    async: false,

    success: function(response){
        dataThreatType = response
    }
});



function createTreeData(data, type, word){
    let tList = [];
    let TH = {};
    treeDict = data
    threatType = type
    let typeCat = 'test'

            for (let key in treeDict) {
                if (key.includes(word)) {
                  let list = treeDict[key];
                  list.forEach(function(element) {
                    if (element.split('.').length === 3){
                        typeCat = threatType[element.split('.')[0]+'.'+element.split('.')[1]] + ' - '+ threatType[element];
                    }else {
                        typeCat = threatType[element]
                    }
                    let name = element.split('.')[0];
                    let entry = {'name': element, 'numT': 1,'category':typeCat, 'species':[key],'value':1};
                  
                    if (name in TH) {
                      let children = TH[name]['children'];
                      let existingEntryIndex = children.findIndex(function(child) {
                        return child['name'] === element;
                      });
                  
                      if (existingEntryIndex !== -1) {
                        children[existingEntryIndex]['numT'] += 1;
                        if (!children[existingEntryIndex]['species'].includes(key)) {
                            children[existingEntryIndex]['species'].push(key);
                            children[existingEntryIndex]['value'] += 1
                        }
                      } else {
                        children.push(entry);
                      }
                    } else {
                      TH[name] = {'name': name, 'children': [entry]};
                    }
                  });

                  }
                }
              
        //console.log(tList)
            
            
            
    
    
    
        let threatDict = {'name':'All', 'children': Object.values(TH)}
        return threatDict
};

const searchBar = document.getElementById('search-bar');
  const searchButton = document.getElementById('search-button');

  let searchText = '';

  searchBar.addEventListener('input', (event) => {
    searchText = event.target.value;
  });

  searchButton.addEventListener('click', () => {
    search(searchText);
  });

  searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      search(searchText);
    }
  });

  function search(text) {
    console.log(`Searching for "${text}"...`);
    // Add your search functionality here.
    let selectedWord = text; //Add Search Word
    console.log(createTreeData(dataThreatTotal,dataThreatType,selectedWord));
    drawTreeMap(createTreeData(dataThreatTotal,dataThreatType,selectedWord));
  };

let selectedWord = 'Abarema'; //text; //Add Search Word
console.log(createTreeData(dataThreatTotal,dataThreatType,selectedWord));
drawTreeMap(createTreeData(dataThreatTotal,dataThreatType,selectedWord));


