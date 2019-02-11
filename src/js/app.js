import $ from "jquery";

require("webpack-jquery-ui");
import "../css/styles.css";
import {
  debug
} from "util";

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
    DOM.$board = $(".board");
    DOM.$listDialog = $("#list-creation-dialog");
    DOM.$cardDialog = $("#card-dialog");
    DOM.$columns = $(".column");
    DOM.$lists = $(".list");
    DOM.$newListButton = $("button#new-list");
  }

  function createColumn(title) {
    $(`<div class="column">
            <div class="list">
                <div class="list-header">
                    ${$("#list-title").val()}
                    <button class="btn btn-light delete float-right">X</button>
                </div>
                <ul class="list-cards">
                </ul>
                <div class="add-new">
                    <form class="new-card input-group mb-3" action="index.html">
                        <input type="text" class="form-control card-title" placeholder="Please name the card">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="submit">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`).insertBefore($(".column").last());

    sortCards();
  }

  function createDialogs() {
    $("#list-title-form").on("submit", function (e) {
      e.preventDefault();
    });

    DOM.$listDialog.dialog({
      modal: true,
      autoOpen: false,
      show: {
        effect: "bounce",
        times: 2,
        duration: 300,
        distance: 50
      },
      hide: {
        effect: "puff",
        duration: 300
      },
      buttons: [{
          text: "Ok",
          click: function () {
            let listTitle = $("#list-title").val();
            createColumn(listTitle);
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

    DOM.$cardDialog.dialog({
      modal: true,
      autoOpen: false,
      width: 500,
      height: 450,
      show: {
        effect: "bounce",
        times: 2,
        duration: 300,
        distance: 50
      },
      hide: {
        effect: "puff",
        duration: 300
      },
      buttons: [{
          text: "Ok",
          click: function () {
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

    $("#tabs").tabs();
    $("#datepicker").datepicker({
      showAnim: "blind"
    });
  }

  function sortCards() {
    $(".list-cards").sortable({
      connectWith: ".list-cards"
    });
  }

  function openCardDialog() {
    DOM.$cardDialog.dialog("open");
  }

  /*
   *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
   *  createList, deleteList, createCard och deleteCard etc.
   */
  function bindEvents() {
    DOM.$newListButton.on("click", createList);

    $(document).on("submit", ".new-card", createCard);
    $(document).on("click", ".list-header button.delete", deleteList);
    $(document).on("click", ".card button.delete", deleteCard);

    $(document).on("click", ".card", openCardDialog);
  }
  /* ============== Metoder för att hantera listor nedan ============== */
  function createList(event) {
    event.preventDefault();
    DOM.$listDialog.dialog("open");
    $("#list-title").val('');
  }

  function deleteList() {
    $(this)
      .closest(".column")
      .remove();
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    let cardTitle = $(this).children(".card-title");
    let cardLi =
      `<li class="card">
        <span class="card-text">${cardTitle.val()}</span>
        <button class="button delete">X</button>
      </li>`;

    $(this).closest(".list").children(".list-cards").append(cardLi);
    cardTitle.val('');
  }

  function deleteCard() {
    $(this)
      .closest(".card")
      .remove();
  }

  // Metod för att rita ut element i DOM:en
  function render() {}

  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(":::: Initializing JTrello ::::");
    // Förslag på privata metoder
    captureDOMEls();
    bindEvents();
    createDialogs();
    sortCards();
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