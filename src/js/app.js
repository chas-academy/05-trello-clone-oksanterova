import $ from 'jquery';

require('webpack-jquery-ui');
import '../css/styles.css';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function () {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');

    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$newCardForm = $('form.new-card');
    DOM.$deleteCardButton = $('.card > button.delete');
  }

  function createTabs() {}

  function createColumn(title) {

    $(`<div class="column">
            <div class="list">
                <div class="list-header">
                    ${$('#list-title').val()}
                    <button class="button delete">X</button>
                </div>
                <ul class="list-cards">
                    <li class="add-new">
                        <form class="new-card" action="index.html">
                            <input type="text" name="title" placeholder="Please name the card" />
                            <button class="button add">Add new card</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>`
    ).insertBefore("#new-list");
  }


  function createDialogs() {
    DOM.$listDialog.dialog({
      modal: true,
      autoOpen: false,
      show: {
        effect: 'bounce',
        times: 2,
        duration: 300,
        distance: 50
      },
      hide: {
        effect: 'puff',
        duration: 300
      },
      buttons: [{
          text: "Ok",
          click: function () {
            let title = $('#list-title').val();
            createColumn(title);
            title = '';
            $(this).dialog("close");
          }
        },
        {
          text: "Cancel",
          click: function () {
            $(this).dialog("close");
          }
        }
      ]
    });
  }

  /*
   *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
   *  createList, deleteList, createCard och deleteCard etc.
   */
  function bindEvents() {
    DOM.$newListButton.on('click', createList);
    DOM.$deleteListButton.on('click', deleteList);

    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList() {
    event.preventDefault();
    console.log("This should create a new list");
    DOM.$listDialog.dialog("open");
  }

  function deleteList() {
    $(this).closest('.column').remove();
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    console.log("This should create a new card");
  }

  function deleteCard() {
    console.log("This should delete the card you clicked on");
  }

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(':::: Initializing JTrello ::::');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createDialogs();

    bindEvents();
  }

  // All kod här
  return {
    init: init
  };
})();

//usage
$("document").ready(function () {
  jtrello.init();
});