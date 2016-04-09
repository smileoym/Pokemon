var displayedType = '';

$(document).ready(function() {

  $(".pokemon").click(renderProfile)

  $(document).on('click', '.abilities div', function(event) {
    var currentType = $(event.target).html()
    if (displayedType == currentType) {
      $('.pokemon').show()
      displayedType = ''
    } else {
      $('.pokemon').hide()
      $('.' + currentType).parents('.pokemon').show()
      displayedType = currentType
    }
  })
});

var renderProfile = function(event) {
  $("#rectangle-profile").html($(event.target).children(".hidden-info").html()).show();
}

var statisticRow = function(label, value) {
  return '<tr><td class="key">' + label + '</td><td class="value">' + value + '</td></tr>';
}

var parseData = function(d) {
  var currentInfo = {}
  currentInfo.name = d.name
  currentInfo.weight = d.weight
  currentInfo.types = []
  d.types.forEach(function(t, i) {
    currentInfo.types[i] = t.type.name
  });
  currentInfo.totalMoves = d.moves.length
  d.stats.forEach(function(s) {
    currentInfo[s.stat.name] = s.base_stat
  });
  return currentInfo;
}

var formatId = function(id) {
  if (id < 100) {
    return ' #0'+id;
  } else {
    return ' #'+id;
  }
}

var renderPokemonFromAPI = function(id) {
  $.get("http://pokeapi.co/api/v2/pokemon/" + id, function(data) {
    $("#rectangle" + data.id + " .name").html(data.name);
    currentInfo = parseData(data)
    var profileImage = '<img src="http://pokeapi.co/media/img/' + data.id + '.png" alt="pokemon picture"><div>'
    var profileTable = '</div><table>' + statisticRow('Type', currentInfo.types[0]) + statisticRow('Attack', currentInfo.attack) + statisticRow('Defense', currentInfo.defense) + statisticRow('HP', currentInfo.hp) + statisticRow('SP Attack', currentInfo['special-attack']) + statisticRow('SP Defense', currentInfo['special-defense']) + statisticRow('Speed', currentInfo.speed) + statisticRow('Weight', currentInfo.weight) + statisticRow('Total moves', currentInfo.totalMoves) + '</table>'
    $("#rectangle" + data.id + " .hidden-info").html(profileImage + data.name + formatId(data.id) + profileTable);
    $(".pokemon").click(renderProfile)
    for (var y = 0; y < data.types.length; y++) {
      data.types[y].type.name
      prefContent = $("#ability-" + (data.id)).html()
      typeContent = prefContent + "<div class=\"" + data.types[y].type.name + " type\">" + data.types[y].type.name + "</div>"
      $("#ability-" + (data.id)).html(typeContent);
    };
  });
};

function displ(loadMore) {
  var visiblePokemonsCount = $('.pokemon').length;
  [0, 1, 2].forEach(function(i) {
    var nextPokemon = visiblePokemonsCount + i
    var currentPokemon = visiblePokemonsCount + i - 1
    var newContent = $('#pokemon-template').html().replace(/1/g, nextPokemon)
    $('#rectangle' + currentPokemon).after(newContent)
    renderPokemonFromAPI(nextPokemon)
  });
}
