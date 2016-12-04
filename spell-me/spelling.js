
sound_base_url = 'http://www.collinsdictionary.com';
dictionary_url = 'http://www.collinsdictionary.com/dictionary/english/'

// words = [
//   ['hello', sound_base_url+'/sounds/e/en_/en_gb/en_gb_hello.mp3'],
//   ['please', sound_base_url+'/sounds/e/en_/en_gb/en_gb_hello.mp3']
// ];

word_text = function(word) {
  return word[0];
}

word_sound = function(word) {
  return word[1];
}

play_sound = function(sound_url) {
  new Audio(sound_url).play();
  return false;
}

word_dictionary_url = function(word) {
  return dictionary_url + word_text(word);
}

word_to_html = function(word, i) {
  return '<tr id="word-'+i+'">'+
      ( word_sound(word) !== '' ?
        '<td class="number" width="1%">'+(i+1)+'</td>'+
        '<td width="1%">'+
          '<a href="#" onclick="return play_sound(\''+word_sound(word)+'\')">say</a> '+
        '</td><td width="1%">'+
          '<a class="word" style="display: none" href="'+word_dictionary_url(word)+'" target="_blank">dictionary</a>'+
        '</td><td>'+
          '<span class="word" style="display: none"><b>'+word_text(word)+'</b></span> '+
        '</td>' : '' )+
      '<td class="editor" style="display:none">'+
        '<input type="text" class="word-text" value="'+word_text(word)+'"/>'+
        '<input type="text" class="word-sound" value="'+word_sound(word)+'"/>'+
        '<a class="word" href="'+word_dictionary_url(word)+'" target="_blank">dictionary</a>'+
      '</td>'+
    '</tr>'
};

words_to_html = function(words) {
  return '<table class="table">'+
    words.concat([['','']]).map(word_to_html).join('')+
    '</table>';
};

render_words = function(words) {
  $('#words').html(words_to_html(words));
}

show_words = function() {
  $('#show-words-link').hide();
  $('.word').show();
  $('#hide-words-link').show();
  return false;
}

hide_words = function() {
  $('#hide-words-link').hide();
  $('.word').hide();
  $('#show-words-link').show();
  return false;
}

to_str = function(json) {
  return JSON.stringify(json);
}

compress_words = function(words) {
  return LZString.compressToEncodedURIComponent(to_str(words));
}

to_json = function(str) {
  return JSON.parse(str);
}

decompress_words = function(str) {
  return to_json(LZString.decompressFromEncodedURIComponent(str));
}

show_spelling_url = function(words) {
  $('#data').html(compress_words(words));
}

edit_words = function() {
  $('#edit-words-link').hide();
  $('#words .editor').show();
  $('#save-words-link').show();
}

to_url = function(words) {
  return window.location.origin + window.location.pathname + '?' + compress_words(words);
}

save_to_url = function(words) {
  window.location.href = to_url(words);
}

save_words = function() {
  new_words = [];
  $('#words .editor').each(function(){
    word = $(this).find('input.word-text').val();
    if( word !== '' ) {
      sound = $(this).find('input.word-sound').val();
      if( !/^http/.test(sound) ) { sound = sound_base_url + sound }
      new_words.push([word, sound]);
    }
  });
  save_to_url(new_words);
}

words_from_url = function() {
  query = window.location.search.substring(1);
  return decompress_words(query);
}

shuffle = function(a) {
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

function reset_links() {
  hide_words();
  $('#save-words-link').hide();
  $('#edit-words-link').show();
}

shuffle_words = function() {
  render_words(shuffle(words_from_url()));
  reset_links();
}

init = function() {
  render_words(words_from_url());
}

init();
