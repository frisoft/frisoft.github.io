
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
  return '<div id="word-'+i+'">'+
      ( word_sound(word) !== '' ?
        '<span class="number">'+(i+1)+' - </span>'+
        '<span>'+
          '<a href="#" onclick="return play_sound(\''+word_sound(word)+'\')">say</a> '+
          '<span class="word" style="display: none">'+word_text(word)+'</span> '+
          '<a class="word" style="display: none" href="'+word_dictionary_url(word)+'" target="_blank">dictionary</a>'+
        '</span>' : '' )+
      '<span class="editor" style="display:none">'+
        '<input type="text" class="word-text" value="'+word_text(word)+'"/>'+
        '<input type="text" class="word-sound" value="'+word_sound(word)+'"/>'+
        '<a class="word" href="'+word_dictionary_url(word)+'" target="_blank">dictionary</a>'+
      '</span>'+
    '</div>'
};

words_to_html = function(words) {
  return words.concat([['','']]).map(word_to_html).join('');
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
  // $('#save-words-link').hide();
  new_words = [];
  $('#words .editor').each(function(){
    word = $(this).find('input.word-text').val();
    if( word !== '' ) {
      sound = $(this).find('input.word-sound').val();
      if( !/^http/.test(sound) ) { sound = sound_base_url + sound }
      new_words.push([word, sound]);
    }
  });
  // show_spelling_url(new_words);
  // render_words(new_words);
  // $('#words .editor').hide();
  // $('#edit-words-link').show();
  save_to_url(new_words);
}

words_from_url = function() {
  query = window.location.search.substring(1);
  return decompress_words(query);
}

init = function() {
  console.log(words_from_url());
  render_words(words_from_url());
}

init();
