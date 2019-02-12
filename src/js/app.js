import $ from "jquery";

require("webpack-jquery-ui");
import "../css/styles.css";
import {
  debug
} from "util";

// custom widget
$(function () {
  $.widget("custom.customize", {
    options: {
      urls: [
        "https://images.unsplash.com/photo-1501023453312-ce090afb9e40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1085&q=80",
        "https://images.unsplash.com/photo-1524553496250-1a722745ae00?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=968&q=80",
        "https://images.unsplash.com/photo-1548700819-892a76eed325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1053&q=80",
        "https://images.unsplash.com/photo-1532958808832-aae08f887875?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1549176755-e67f625da235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1046&q=80",
        "https://images.unsplash.com/photo-1545383541-325a7082c04e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1545577348-1b31905a601c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
        "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1476837579993-f1d3948f17c2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        "https://images.unsplash.com/photo-1487587090589-f458461e549d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
      ],
      delay: 1
    },

    _create: function () {
      $("#customize").on("click", this._updateImage.bind(this));
    },

    _updateImage: function () {
      let random = Math.floor(Math.random() * this.options.urls.length);
      let url = this.options.urls[random];

      $("body").css({
        "transition": `background-image ${this.options.delay}s ease-in-out`,
        "background-image": `url(${url})`
      });
    }
  });
});


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
    let cardInput = $(this).children(".card-text").text();
    // debugger;
    $("#card-dialog-input").val(cardInput);
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

  function deleteCard(event) {
    event.preventDefault();
    event.stopPropagation();
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
    $("#customize").customize();
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