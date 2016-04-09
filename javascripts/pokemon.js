var displayedType = '';

$(document).ready(function() {
  $(".pokemon").click(renderProfile)
  $(document).on('click', '.hide-profile', function(event) {
    $("#rectangle-profile").hide();
  })
  $(document).on('click', '.abilities div', function(event) {
    $('.type').removeClass('closeable')
    var currentType = $(event.target).html()
    if (displayedType == currentType) {
      $('.pokemon').show()
      displayedType = ''
    } else {
      $('.pokemon').hide()
      $('.' + currentType).parents('.pokemon').show()
      $('.' + currentType).addClass('closeable')
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
  var info = {}
  info.name = d.name
  info.weight = d.weight
  info.types = []
  d.types.forEach(function(t, i) {
    info.types[i] = t.type.name
  });
  info.totalMoves = d.moves.length
  d.stats.forEach(function(s) {
    info[s.stat.name] = s.base_stat
  });
  return info;
}

var formatId = function(id) {
  if (id < 100) {
    return ' #0'+id;
  } else {
    return ' #'+id;
  }
}

var profileTableContents = function(data){
  var contents = ''
  var dataArray = [
    ['Type', data.types.join(', ')],
    ['Attack', data.attack],
    ['Defense', data.defense],
    ['HP', data.hp],
    ['SP Attack', data['special-attack']],
    ['SP Defense', data['special-defense']],
    ['Speed', data.speed],
    ['Weight', data.weight],
    ['Total moves', data.totalMoves]
  ];
  dataArray.forEach(function(i) {
    contents += statisticRow(i[0], i[1])
  });
  return contents;
}

var renderPokemonFromAPI = function(id) {
  $.get("http://pokeapi.co/api/v2/pokemon/" + id, function(data) {
    $("#rectangle" + data.id + " .name").html(data.name);
    currentInfo = parseData(data)
    var profileImage = '<div class="hide-profile"></div><img src="http://pokeapi.co/media/img/' + data.id + '.png" alt="pokemon picture"><div>'
    var profileTable = '</div><table>' + profileTableContents(currentInfo) + '</table>'
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
