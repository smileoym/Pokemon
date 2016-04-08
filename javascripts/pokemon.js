var displayedType = '';

$(document).ready(function() {

  $(".pokemon").click(renderProfile)

  $(document).on('click', '.abilities div', function(event) {
    var currentType = $(event.target).html()
    if (displayedType == currentType) {
      $('.rectangle').show()
      displayedType = ''
    } else {
      $('.rectangle').hide()
      $('.' + currentType).parents('.rectangle').show()
      displayedType = currentType
    }
  })
});

var renderProfile = function(event) {
  $("#rectangle-profile").html($(event.target).children(".hidden-info").html()).show();
}

var statisticRow = function(label, value) {
  resalt = '<tr><td class="key">' + label +
    '</td><td class="value">' + value +
    '</td></tr>'
  return resalt;
}

var parseData = function(d) {
  var currentInfo = {}
  currentInfo.name = d.name
  currentInfo.weight = d.weight
  currentInfo.types = []
  for (var i = 0; i < d.types.length; i++) {
    currentInfo.types[i] = d.types[i].type.name
  }
  currentInfo.totalMoves = d.moves.length
  for (var i = 0; i < d.stats.length; i++) {
    currentInfo[d.stats[i].stat.name] = d.stats[i].base_stat
  }
  return currentInfo;
}

var renderPokemonFromAPI = function(id) {
  $.get("http://pokeapi.co/api/v2/pokemon/" + id, function(data) {
    $("#rectangle" + data.id + " .name").html(data.name);
    currentInfo = parseData(data)
    var profileImage = '<img src="http://pokeapi.co/media/img/' + data.id + '.png" alt="pokemon picture"><div>'
    var profileTable = '</div><table>' + statisticRow('Type', currentInfo.types[0]) + statisticRow('Attack', currentInfo.attack) + statisticRow('Defense', currentInfo.defense) + statisticRow('HP', currentInfo.hp) + statisticRow('SP Attack', currentInfo['special-attack']) + statisticRow('SP Defense', currentInfo['special-defense']) + statisticRow('Speed', currentInfo.speed) + statisticRow('Weight', currentInfo.weight) + statisticRow('Total moves', currentInfo.totalMoves) + '</table>'
    $("#rectangle" + data.id + " .hidden-info").html(profileImage + data.name + "#" + data.id + profileTable);
    $(".pokemon").click(renderProfile)
    for (var y = 0; y < data.types.length; y++) {
      data.types[y].type.name
      prefContent = $("#ability-" + (data.id)).html()
      typeContent = prefContent + "<div class=\"" + data.types[y].type.name + " type\">" + data.types[y].type.name + "</div>"
      $("#ability-" + (data.id)).html(typeContent);
    };
  });
};

var newDivsStart = '<div id="rectangle'
var newDivsImage = '" class="rectangle pokemon"><img src="http://pokeapi.co/media/img/'
var newDivsTypes = '.png" alt="pokemon picture" width="100" height="100"><div class="name"></div><div class="abilities" id="ability-'
var newDivsEnd = '"></div><div class="hidden-info"></div></div>'

function displ(loadMore) {
  var visiblePokemonsCount = $('.rectangle').length;
  for (var i = visiblePokemonsCount; i < (visiblePokemonsCount + 3); i++) {
    $('#rectangle' + i).after(newDivsStart + (i + 1) + newDivsImage + (i + 1) + newDivsTypes + (i + 1) + newDivsEnd)
    renderPokemonFromAPI(i + 1)
  }
}
