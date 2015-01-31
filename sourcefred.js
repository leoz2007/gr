(function() {
  var DomCoolTest,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DomCoolTest = (function() {
    function DomCoolTest(onCool, t) {
      this.onCool = onCool;
      this.t = t;
      this.warm = __bind(this.warm, this);
      this.timer = null;
    }

    DomCoolTest.prototype.warm = function() {
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      return this.timer = setTimeout(((function(_this) {
        return function() {
          _this.timer = null;
          return _this.onCool();
        };
      })(this)), this.t);
    };

    DomCoolTest.prototype.isWarm = function() {
      return this.timer != null;
    };

    return DomCoolTest;

  })();

  if (window.fbg == null) {
    window.fbg = {};
  }

  window.fbg.DomCoolTest = DomCoolTest;

}).call(this);
(function() {
  fbg.DrawTools = (function() {
    function DrawTools() {
      var drawButton, dropper, rangePicker, reportButton, showGraffitiButton, fredButton, utilities;
      this.selectorOpen = false;
      this.eyeDropping = false;
      this.stageUI = $('.snowliftPager,.stageActions');
      this.container = $('<div>').css({
        height: 30,
        margin: 4,
        position: 'absolute',
        cursor: 'pointer'
      });
      this.selectors = $('<div>').css('float', 'left');
      utilities = $('<div>').css('float', 'left');
      this.selectors.hide();
      rangePicker = $('<input type="range" id="brushRange" value="40">').css({
        width: 60,
        float: 'left'
      }).click(function(e) {
        return e.stopPropagation();
      }).change((function(_this) {
        return function() {
          return _this.updateCursor();
        };
      })(this));
      dropper = $('<img>').attr({
        id: 'dropper',
        src: 'http://simpleicon.com/wp-content/uploads/eyedropper-64x64.png'
      }).css({
        float: 'left'
      }).click((function(_this) {
        return function() {
          var color;
          color = _this.eyeDropping ? 'white' : 'black';
          dropper.css('border-color', color);
          _this.eyeDropping = !_this.eyeDropping;
          return _this.updateCursor();
        };
      })(this));
      $("<input type='text'/>").attr({
        id: 'custom'
      }).css({
        float: 'left'
      }).prependTo(this.selectors).spectrum({
        color: "#000",
        change: (function(_this) {
          return function(c) {
            return _this.updateCursor();
          };
        })(this),
        show: (function(_this) {
          return function() {
            return _this.selectorOpen = true;
          };
        })(this),
        hide: (function(_this) {
          return function() {
            _this.selectorOpen = false;
            return _this.updateCursor();
          };
        })(this)
      });
      showGraffitiButton = $('<button id="toggleG">Hide Graffiti</button>').css({
        float: 'left',
        width: 80
      }).click(function() {
        if (fbg.showGraffiti) {
          $(this).text('Show');
          fbg.canvas.hide();
        } else {
          $(this).text('Hide graffiti');
          fbg.canvas.show();
        }
        return fbg.showGraffiti = !fbg.showGraffiti;
      });
      drawButton = $('<button id="toggleDrawing"></button>').text(fbg.drawing ? 'Stop' : 'Draw').css({
        float: 'left',
        width: 80
      }).click((function(_this) {
        return function() {
          if (fbg.drawing) {
            _this.stageUI.show();
            drawButton.text('Draw');
            fbg.canvas.postToServer();
          } else {
            _this.stageUI.hide();
            drawButton.text('Stop');
          }
          _this.selectors.toggle();
          utilities.toggle();
          if (!fbg.showGraffiti && fbg.drawing === false) {
            showGraffitiButton.trigger('click');
          }
          fbg.drawing = !fbg.drawing;
          return _this.updateCursor();
        };
      })(this));

      fredButton =  $('<button id="fred"></button>').text('Ajouter une data').css({
        float: 'left',
        width: 150
      }).click((function(_this) {
        return function() {
          img = $('.dataimg').val();

          data = {
        id: this.id,
        img: img,
        url: this.img.attr('src'),
        owner: this.owner
      };

      error = function(XHR, err) {
        return console.log("There was an error posting to server " + err);
      };
      return $.ajax({
        type: 'POST',
        url: "" + fbg.host + "setImage",
        data: data,
        error: error
      });

        };
      })(this));

      reportButton = $('<button id="fredbutton">FRED!</button>').css({
        float: 'left',
        width: 80
      }).click((function(_this) {
        return function() {
          var data, report, text;
          text = 'Does this graffiti contain any: abuse, harrasment or egregiously offensive material? Remember, you can always remove graffiti from your own photos! For more information visit http://fbgraffiti.com/faq/';
          report = confirm(text);
          if (report) {
            data = {
              id: fbg.canvas.id
            };
            $.ajax({
              type: 'POST',
              url: "" + fbg.host + "report",
              data: data
            });
            return alert('It will be evaluated and potentially removed, thanks.');
          }
        };
      })(this));
      reportButton = $('<button id="report">Report</button>').css({
        float: 'left',
        width: 80
      }).click((function(_this) {
        return function() {
          var data, report, text;
          text = 'Does this graffiti contain any: abuse, harrasment or egregiously offensive material? Remember, you can always remove graffiti from your own photos! For more information visit http://fbgraffiti.com/faq/';
          report = confirm(text);
          if (report) {
            data = {
              id: fbg.canvas.id
            };
            $.ajax({
              type: 'POST',
              url: "" + fbg.host + "report",
              data: data
            });
            return alert('It will be evaluated and potentially removed, thanks.');
          }
        };
      })(this));
      this.undoButton = $('<button id="undo" disabled>Undo</button>').css({
        float: 'left',
        width: 80
      }).click((function(_this) {
        return function() {
          fbg.canvas.undo();
          if (fbg.canvas.history.length === 0) {
            return _this.undoButton.prop("disabled", true);
          }
        };
      })(this));
      dropper.prependTo(this.selectors);
      rangePicker.prependTo(this.selectors);
      this.undoButton.appendTo(this.selectors);
      showGraffitiButton.appendTo(utilities);
      reportButton.appendTo(utilities);
      drawButton.appendTo(this.container);
      fredButton.appendTo(this.container);
      this.selectors.appendTo(this.container);
      utilities.appendTo(this.container);
      this.container.prependTo($(document.body));
      fbg.mouse.addListener('mousemove', (function(_this) {
        return function(_arg) {
          var c, currX, currY, onCanvas;
          currX = _arg.currX, currY = _arg.currY, onCanvas = _arg.onCanvas;
          if (_this.eyeDropping && onCanvas) {
            c = fbg.canvas.getColor(currX, currY);
            return _this.setColor(c);
          }
        };
      })(this));
      fbg.mouse.addListener('mousedown', (function(_this) {
        return function(_arg) {
          var onCanvas;
          onCanvas = _arg.onCanvas;
          console.log(onCanvas, _this.eyeDropping);
          if (_this.eyeDropping && onCanvas) {
            return dropper.trigger('click');
          }
        };
      })(this));
      this.hide();
    }

    DrawTools.prototype.hide = function() {
      $('#custom').spectrum("hide");
      this.undoButton.prop("disabled", true);
      return this.container.hide();
    };

    DrawTools.prototype.show = function() {
      $('.rhcHeader').css('height', 40).prepend(this.container);
      $('#toggleG').text('Hide graffiti');
      this.updateCursor();
      return this.container.show();
    };

    DrawTools.prototype.setColor = function(c) {
      return $('#custom').spectrum('set', c);
    };

    DrawTools.prototype.color = function() {
      var t;
      t = $('#custom').spectrum('get');
      if (t != null) {
        return t.toRgbString();
      } else {
        return "rgba(255, 0, 0, 0)";
      }
    };

    DrawTools.prototype.size = function() {
      var _ref;
      return (parseInt((_ref = $('#brushRange')[0]) != null ? _ref.value : void 0) / 3) + 2;
    };

    DrawTools.prototype.updateCursor = function(color) {
      var ctx, cursor, size;
      if (!fbg.drawing) {
        return $('.canvas').css({
          'cursor': 'default'
        });
      } else if (this.eyeDropping) {
        return $('.canvas').css({
          'cursor': 'crosshair'
        });
      } else {
        cursor = document.createElement('canvas');
        ctx = cursor.getContext('2d');
        color = $('#custom').spectrum('get');
        size = this.size();
        cursor.width = size * 5;
        cursor.height = size * 5;
        ctx.beginPath();
        ctx.arc(size, size, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = color.toRgbString();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = color.getBrightness() > 100 ? '#000000' : '#FFFFFF';
        ctx.stroke();
        return $('.canvas').css({
          'cursor': "url(" + (cursor.toDataURL()) + ") " + size + " " + size + ", auto"
        });
      }
    };

    return DrawTools;

  })();

}).call(this);
(function() {
  fbg.FbgCanvas = (function() {
    function FbgCanvas(img, id, url) {
      var height, left, top, width;
      this.img = img;
      this.id = id;
      this.changesMade = false;
      this.img.addClass('hasCanvas');
      this.stage = $('.stage').first();
      this.owner = fbg.get.owner() || fbg.urlParser.owner(fbg.currentPage);
      this.history = [];
      top = "" + (Math.floor((this.stage.height() - this.img.height()) / 2)) + "px";
      left = "" + (Math.floor((this.stage.width() - this.img.width()) / 2)) + "px";
      width = this.img.width();
      height = this.img.height();
      this.canvas = $('<canvas>').attr({
        id: "canvas" + this.id,
        width: width,
        height: height
      }).css({
        position: 'absolute',
        top: top,
        left: left,
        cursor: "crosshair",
        'z-index': 2
      }).addClass('canvas').click(function(e) {
        return e.stopPropagation();
      });
      this.ctx = this.canvas[0].getContext('2d');
      this.graffitiImage = $('<img>').attr({
        src: url,
        id: "" + this.id + "img",
        'crossOrigin': 'anonymous'
      }).load((function(_this) {
        return function() {
          _this.img.addClass('hasGraffiti');
          return _this.ctx.drawImage(_this.graffitiImage[0], 0, 0, width, height);
        };
      })(this));
      this.createImgCopy();
    }

    FbgCanvas.prototype.saveState = function() {
      this.history.push(this.canvas[0].toDataURL());
      return fbg.drawTools.undoButton.prop("disabled", false);
    };

    FbgCanvas.prototype.undo = function() {
      var h, img, restore_state, w;
      restore_state = this.history.pop();
      if (restore_state == null) {
        return;
      }
      img = new Image;
      w = this.canvas[0].width;
      h = this.canvas[0].height;
      if (this.history.length === 0) {
        this.changesMade = false;
      }
      img.onload = (function(_this) {
        return function() {
          _this.ctx.clearRect(0, 0, w, h);
          return _this.ctx.drawImage(img, 0, 0, w, h);
        };
      })(this);
      img.src = restore_state;
      return null;
    };

    FbgCanvas.prototype.resize = function() {
      var height, width;
      width = this.img.width();
      height = this.img.height();
      this.canvas.attr({
        width: width,
        height: height
      });
      if (this.img.hasClass('hasGraffiti')) {
        return this.ctx.drawImage(this.graffitiImage[0], 0, 0, width, height);
      }
    };

    FbgCanvas.prototype.draw = function(_arg) {
      var currX, currY, prevX, prevY, r;
      prevX = _arg.prevX, prevY = _arg.prevY, currX = _arg.currX, currY = _arg.currY;
      if (fbg.drawTools.selectorOpen) {
        return;
      }
      this.changesMade = true;
      r = fbg.drawTools.size();
      this.ctx.beginPath();
      this.ctx.moveTo(prevX, prevY);
      this.ctx.lineTo(currX, currY);
      this.ctx.strokeStyle = fbg.drawTools.color();
      this.ctx.lineCap = 'round';
      this.ctx.lineWidth = r * 2;
      this.ctx.stroke();
      return this.ctx.closePath();
    };

    FbgCanvas.prototype.addTo = function(div) {
      return div.prepend(this.canvas);
    };

    FbgCanvas.prototype.remove = function() {
      var img;
      this.hide();
      if (this.changesMade) {
        img = this.canvas[0].toDataURL();
        this.postToServer(img);
        this.addToOtherCopies(img);
      }
      this.canvas.remove();
      fbg.drawTools.hide();
      this.img.removeClass('hasCanvas');
      return delete fbg.canvas;
    };

    FbgCanvas.prototype.hide = function() {
      return this.canvas.hide();
    };

    FbgCanvas.prototype.show = function() {
      return this.canvas.show();
    };

    FbgCanvas.prototype.postToServer = function(img) {
      var data, error;
      if (!this.changesMade) {
        return;
      }
      if (img == null) {
        img = this.canvas[0].toDataURL();
      }
      //img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAgAElEQVR4nO2de3Bb153fv+fce3EBECRIStTDlklatmk6bkLuKlLorKeid9PY3U5XlGRpN5S9ppOMM7OKbLX/0I5nGk6nnTbbmUaJnZ2u213TkeRmpSGl7DTbzTRpaNdx/Ig2lB0rkm3JIiRaFN8g3riP0z9AUHzgcS9w7wVAnM8fGhG4j0PwfvF7nN/5HYDD4XA4HA6Hw+FwOBwOh8PhcDgcDofD4XA4HA6Hw+FwOBwOh8PhcDgcDofD4XA4HA6Hw+FwOBwOh8PhcDgcDofD4XA4HA6Hw+GsQ0ipB8CpHE5+s+fbDOgGAAbMU0oGD33/zI9LPCxb4QLhGOLk03v3MIaza95gbIQw2nfoB8NjJRiW7dBSD4BTGTDGejK+QUi3TvXRE4f3PuHwkByBWxBOXk4e3tfCKLua7zjG2NHHXzz7PQeG5BjcgnDywqg+YOQ4QsixE0d6vmvzcBxFKPUAOOXNycP7WkAwaPwM0rV/VzuG37n4mm2DchBuQTg5MWo9VpxDyMB6iUl4DMLJitHYIys6+h77wZlXrBuR83ALwslKIdZjBRSDx4/s7bBmNKWBWxBORoq2HoswsHmq085KnSfhFoSTkaKtxyIEpJ4R/eyppw74rbie03CBcNZw8vC+FoD0WXZBQjqTsnLMsus5CBcIZy1E77Phon2VmNniMQhnBaeeOuBPyMpVAlJv9bUrMR7hFoSzAsWlHLVDHMCteMSOa9sFn0nnLHHqqQN+VdR/REDctt2EkC17d7XPn3nn4tu23cNCuAXhLGGn9VgBwUClZLW4QDgAUtZDJzjqxL0ISL3iUhy5V7FwgXAAOGg9FtEJjlaCFeEC4ThqPdIUYkWGnu9tGXq+t8WuMWWCp3k5qbXmhAw4fV8GNi8npNaDL50OZjtmuL93DwPpJoT1AKQ1lkjMzwRD3U//7U/POzFG0YmbcMobRtBXivsSkPqkpPYAWKr4HXq+t4Wq6NGBbkJIT+q4W/96ZLl+gx8j3//qw46IhFuQKufE4b1PgJpZEGUxjI16az1HmU57CFg3COk0clpSUUaDodnub7z0s6zWxwq4QKqcE0d6PgFIq5P3JISAChSCIEAQBBBS2GPohEi4QKoYJ60HoQSiKEKgAqhgXW7IbpHwLFY1Q9mAnZcXRAEulwserwcejweSJFkqDgBwSVLnxsZNtlUKc4FUKanKWtJq5TUJJZAkCW63G94aL2RZhiiJBbtQhu8L0jfUf8iWbircxapSjMYelFJQSkEIAaFkxcMuCGVWysdYz77vvGppK1QukCokW+xBaSpwJpQUFTyXDIZ5JrLO/f/xVcvK6fk8SDVC2QBAVmSTRHEdPAoE9UQjgwAesuqSPAapMl79N/ufEESx1e12w+P1pOKE9SCOW3QP9/fusepiFWZDOYUy/NxXdjNG+oiVa83LFYZ5FcnWg9/JXsJilHX11cFZy/Bzh54AYwNgpLVqvg0J6gVIxwA8WfylOOuSJWGAtJZ2JCWEkc593zlRVL0WtyDrjOH+3j0gOAaG1mr//mNEP4oirUh1f4LriOH+xzpA2DEsbpHGWYTo3fv+0/8suNM8tyAVzqn+A34B0iBIlh2gqh1GB1BE2pdbkAomlc4kgyBwbKlsRVJELMItSAUy9HxvCzQMWNoedB1TTCzCLUiFUazVmAtHc77v88iQyq3GygJUlqwvZF6EW5AKYqj/0HdRYHOFwNQcAlNziCdVQ8e7XSJqPTKamxogChS1Hvt6yTmBSF0rlvYaPs+GsXAs5lT/Ab8IaQQEhpajrubT2SCuTMxA1XTD58STKuJJFVPBCABAFCia/D40+Dxo8vsqz8ro7CgKEAh3scqcVPpWP1vohF8oFse5j6+bEocRfB4ZzU31FSUWJrBWM5W+B3Zs91fGb1alnHm299sg+BGKaOj2myvjht0qMyRVDVPBCMZngtAZg88jQ6DlXftKGeb/7o33886JHNix3f+Zls3PMir+qLx/oypm6NnelxmK61X16WwQ4VjCohFlRtV0XJmYwS8vfIJQLG7rvYqFIX97o7272jp0Ub4KkAFCUM9drDIjPfGX7glVDG9cuGKL9chG2+1NaG5qcOx+BZFjTmTvrrYOgQqjy1/jFqSMSAfjVogjFIs7Kg4AmAqGHb1fIRCiZ/xs933xvhZKhJHVr3OBlBECkY4ZbZyWj8DUfNb3QrEELo1P49L4NAJTQceFVEoYSHem16nOBkmGuSWe5i0DltwqFG850uSbEEwTSyoYm5rHbY21qPXIRd3T7ZKKOt8hule/cOCB9t2MZRGO3aPh5MbKmCNNLKnktAq1HhmytDKB+elsCNGEUtR9ixWYU6zuEK/rJOvkKxdIibFaHIAx67GlvnbNa9emgwhGCs9ENfl9BZ/rJFpSW/F5E4Ksnz8XSAkZerb3ZavFAaRijHy4XSK21K99oCeDkYJiEp9HhqcyXCzMh6JLn/mBB9p35zqWC6REDD3b+7JdDRSMzn34a9xrRKIzhsnF8hIz3NZYZ/qcUqBqGhKKupQIYSz3AjMukBJwpr/3GTu7i8yFY4aPzSSSWFKBppsrTakU9yqpqCAE9X/91JcMbf/GBeIww/29exghtjVbVjTN9Dn+Gje2b25YcpEoIdB1Zvj8SnKv4skkAEBjUtqKdOc6nqd5HWS4/7EOgA3aeY9CS0skUUBzk38p/pBE42V6leJeAUA8mcrU6TprBZC3LosLxCFO9R/wL1bl2ro8VimyatftMv9IVIp7FUskl/5PCFqNnMNdLIcQIA060aPK7uLE1TT4PBXjXiWVW/M8jHGBlA1n+nufsSOdWw5srUD3CgCwaEEYcDXXOVwgNjPc/1iHnUH5amLJ4mbDzVIp7pWqaRkzc4QLpNTog07eLe6gQJr8NRWzmnDN58JdrNJzpr/3Gauqc8uRSrEewMr4AwBASKuR83gWyyaGnu9tYVrxrtVkMIy5cNRw8G1mkrAY0s0bKgFd1wu2rFwgNrG401FBfDobxFw4hqlg2PJmC8XS5K9B2+2bKiZzBQDRZend1RCCEZZjTpQLxAaGn/vKbuSp8clEuj1PuS1gEgWKrY112OT3ocHnLfVwTBONF5765gKxA2bOeiiahguBiaUeVHbQ5K+B2yUhHEsYcsN8HnlREJ6KFEUaRVWh5ii/Of2ri6892nVf1ve5QCwmtXGNsQwJkBLH25fGbLMaokCx4+5tKzojvvPhNbz70TUAwK577sDdt21YcU4lC2I1YSOdVhhGszXl4wKxmtSuToYPvxCYsNWlaru9aUkcCUXF2bd+i+mFWwuqFmLxdSWI5ei6vqK8JBuMsFGCzNlGnua1kOHnDj1hppxkMhi21a3a2liH2xpTVd1TwQh++H/PrRAHAEwvmLu/GjdfLVwqIgZjD8LY2WzvcYFYCcvfmGw5H45P2jSQFNu3pFynhWgcZ9/6LZLq2od7tWDyMf7rOYRvlneDOCBlPXK5V4xhqe0LUZWRbMdxgVhEqpTdeOZqMhi2PVslCqk/7/8+dzGjOAq6pkzx3quBsrckkXgCLEf+lhC21CDu9LkrQcaQ0YpwgVjE4iYthnGiyVo4lsDPz39k2krkQvZL0BI6LgyPW3ZNq1E1zVhwvhyS2c3iAimSk4f3tZx4Zt93CTNXrZtNINMLUQSmghifWTDUfCEXv7s2iYvXp3IeY7ZVT2QyNaZgIIqxN6YLHpudLESiOa1HCrKixejQWxdfYWBXVx/Fs1gFcuLw3idAWTcD6xOoYGojiVAsnnWGXNG0pYrccDwJnzuB2zcUVlL+/thE3mPat20ydc3Glq0ILAoj8MY0Ntzjg29z+WyuE0skDZWVELBMrScHAAwuf4FbEBOcfHrvnhNHel4+fqRnDhSD6T0CBZMVrbksg9+78mELx5MITJneOQwAUJfDOrhEAZ9r3YpdbXcAAOJBY7VKf/KXAyt+/vAnN8omHlE1DfNhY1k5na0VSCYrwi1IHk4e3teiE72HAH2MoRMga4yFKJr7GHMF515ZQkONG3PLGrjFkgquTs6hdZO5zumP7LgXqsbwyc1ZjM/cEtntG/zouHMrZOnWuONBBReGrqPtX23NahEo8UP2NuKu3Ttw+bVzAFIu1/iv59Dy4EZTY7MaXdcxuxA24FqlECgdzfLWAJZZES6QDJx8eu8exlg3gB4G1rpWErcwaz0A5N1HY0OdF9GkgoRy65s5oWi4MRfC1oa1HRFz0eSvQZO/BsAdOY+rb/ZCdAv4zctXseEeH27b2Yj65lsTiPOBKC4MfYj3Xu1dc245uFrz4UjOkhKjDL118ZVHu9r7sNjkmgsEwPEjezuQEkQ3IaQn9SVkLKiggnkvNV+FrkAp7tjox7Xp4AqRLEQT8Hvd8Mr2VNLe9vkGBANRzHwUxsxHmZMIc2M3Mr5+5eeT+Fxvsy3jysfsQsh0ObtAlGwWBJquH6VEGCEE9VUpkONH9nYQHZ2MsB4QdBOgHqSwvYQEat6CGFkWm00kc+GYbQLZ2FYLQabQEuZK7Gvhwp2BGmjvJyF81mXL2DKh6zrmw5EC1nqwkW+89LOsgd2Zdz48v7+r/ShABqtCIGkLQQg604E1aKZowjyFWBCjE4RpkcyF45gJpeYyiu3Ano8NbbWYfN9YUkAAwXb40YiUa6W9EXdMIKqmYSYYMt0BEgDAcq9DB1Ku1v6u9u51K5BXj+zdzRjrZkAPgM5CLUQuqAObVgqUYmOdF36vjGA0YZv1SOP2G7u+FyLa0AAZyyxoUIceUEGb7X2sovEEgobmOjLz/7bd3/e501/ry3fc5XhsfcUgx4/s7aCM9egER/Ui3CajOCGQNJIoYGNdeVTdboQHdyFza1vt3YRtAincpVrJDYNpad3tWR8COXl4Xwsj+iCAbkascJyMQWwWYLEUUsaeb06jGbXYipqs77OPFLCgDuK37stD13VE4gmEY/GCrcZyrgleeEIhiLX5M4IVL5DjR/Z26NBHiM0tPTNRSPxRzqhxLWv2CkhZjlziSKN/qEDYWfxuU1YLAwCuSalGEyyZf50IsA5m0gnY2VKIo9wRTYrXv7UZenQ7Ellm1HO5VavR3zf28GUjGk9gOriAidl5hKIxy8QBANdcKYHoBgVS8RaEMYwabURsNYVMEjpFriLE8M041MVUrhrXwJK18MqtqN8K3NbRhk/Pf7jieC9EtMD4BCWb1Ey5WbquI6GoiCUStje++9hlTORpKl4gFBhdzFRxlpFrx1nRLeDDn9xYqswFgIv/62LW49vQANGks5HNzUq3ANU0HfFkEqqmWzIDboQgdWFKMheXVb6LRchIqcdglkK2GDBLLgvi9kv4/a/eiQ335G/8djt8K1O5BtEDt+Z6VE3DdHABN2fnMTkXxEwwtJSNckocAPCxbM56AOtAIGJCzFoyUK440XStwefJe8xn9m9Dc44iQxcEbEFhqWU2ufLBTypqYZN6FvKBu3Hp/9ST//MB1oFADr50OgjGKkokPpv3E3e7xBVtfnLR8uBG/N6TrajZtHZMTfCYdq2WCOpgwZQgxDKI1Va7V9RlbMa/4gUCACAYcfyWRcyBmF3FZ4YGnwdtt5tbBOXb7Mbvf/VOND+4EYKceiQEkIKtR5q0QIBURUAp+cDTuOJnwWvsd6v4IB0AGMggAUytCS8WtQh34bZGf1EtRkWBotYjw+2S4HFJi5toGrca2Wh5cCM2f9aPsTemob+fLNx6LMICKrA4qy4ItKQu1nL3SvAZb7pd3lPBJjhxpOcTJ7Y4S6NqOjxeNySTi6XSxJLKokiypzXTAnC7RHhc0qIwnFlzweIMLKBC+3Ui9aAXgPCgG8KDqfHOhcKGmrjZwW/djfhpXcvSz1JTE9zbthk6d11YEAAgDIOMYMDJeyqqVrBAPC4J9zdvsXhE1kHcBKRNAm2ToAdUaO8uCiVhfNJOD6hL+a9SxiHLrQdgzoKsG4GA0UEQNuDU7QhJNUYG7A24ywHaLII2iymrMqmBBVToATUVYwTLa3uG1VyTfLjuWjnJKVajiwUAJ77Z8wuQ1FJJJwgnFWxqMJ9br0ZC0RhCUWc291nO39XfvUIg1ONBTXu74fPXRxZrEUrIgJP3c3KSq9IpxWc1JXrWWg+/uS+0dSWQ3hfOvAbGRpy8Z2L13necJRRVRTAcwc3Z+ZIE6BuJDr++8r5SY2OWozOzfmKQRSghAzqcmxdJKipkqXK2I7ODhKIgqdzKdKX3BCxlWpcSApkAX47dxOmaVEcX6vGAyuZixnVlQYBFKwI26NT9UoF6dTMfiizFGKFoDJF4ouRlJZKQ+u6/VwmhTVlIvWbSegDrUCAA4EpIR1nm1pKWo1jUNb1S0XW95GJYjUCFFcuhH4mntpkwG38A61QgB186HaRksXuJzWi6c+Xa5UgwYl3neKuQVs25bCAaHmhwmXavgHUqEAA49P0zP2Y5dg6ygnSOfLn/XU0Y3eLMSVyiuKZOThAovhQqbLuGdSsQAJCTUp+dlb7pArxqzWQlyuyLgRKasZGfJAqoT0bROR0wf00rBlauHHzpdJAw2mN3PFKtFiRucF23U7gylP1QQpbKXB65/j7cqrkvs3UtEAA49IPhMYB02ymSao1D7F4/boZMrhUAyMsWp7k1Be3zmXsLZ2PdCwQAHn/hzHm7RVJOD4sTxBJJS7uNFIMoCBldK0oI3Ks6UT5y/X1T164KgQD2i6Tc3A27KZfflxCyNOexmhrv2qyVW1NMxSJVIxAgJRKq005k2IuuWJKKCr3M5gPsolyyVwSALGauYvC6XVlL7M24WVUlECAVk7gSUqcd2a1oGTw0ThCJF7e5qFW4RClj3OGSxBWxx2ragzdQnzA2f1N1AgFS2a3HXjz7e1aXpJSL22E30TIQiEsUMzYPd0kiagys+TdqRapSIGkee+HskxQoOC4RV/2Bkoq67rNZ4Vi85KUlkiBmDMo9ssuQOABgS8zYHihVLRAgVdy4GJcMWnG9cvDN7SSSZ39FuxEoXRNbEAC1Ne41GatctIaM7fFe9QIBUnFJ2poUu54kXOIHyE5C0VhJrYdAKVyrgnICwFfjNr3mvT4ZNTRpyAWyjN4XzrzmSko9hLGBQt0uxlhZ+OhWo+t6ScWfSRwCpair9RbcEKI1nN+KrKs16VZy6qkDfsWlHGVADwjpzHRMXFERz7AexCWJ2Oivs32MThIMR0qWvcokDpckwuN2gRbRwG9kaztGbsu9Pp0LxACvHtm7W2PsKCFkRRf5bAIBgA3+2nWz0lBRVUzNL5Tk3pTQNZ+j0UxVPq76NmLw3gdzHsMFYoKTh/e1MLBuEHYUhHTmEojbJaGxzvieGuXMdHChJAWZhBDIq+Y6rBJHmoEduXfO4AIpkFNPHfDPsMgxjbG+bMc01dcV3FiuXAjH4lgowaIoJ8QB5BcID9IL5OBLp4Ma03IuyKr0jJaiqiURh0Ap3JJrhTi8buNzHGbIl+7lAikCSmjOTFcskazYxVS6rmN2IfuGnnYhUGFNQO6WpZylI3bCBWIzpegmaAWzobDjcx6SIK5Z9OSSRHhkY3t52AEXiM0kFbXiXK25UNjRoDxdlbt6PkN2WR9zmIULxAEWItGK6Z/l9DYFAqWQJdeawkPZJcLrLn1jcC4Qh5gLRcp+vYjT4pAEIWPJupPimHfl3mmKC8QhVE3DfLh8ReKkOCghkCUXxAwrAb1ul6OWY17OLhCmquuvN285E08qmA9HUO+rybiWoRTouo5ZB2MOSRAyCoMA8LhdJctWpdGiUajBINRgEHosxgVSDAJRRnVm7g8aTyqYDobQUFtT8klEXdcxHQw5soZFoAJEQchYO0UA1HjdkERnd6Ga8PjBVDUliHAYajAIrPos+Ex6kbz49X9ZUGsPQghqvR74HNpzcDWKqmJ2wf5ULl1sqpDNYlJCUOOVS7JF27uowY9o9n3igXW4/UGlwBjDQiSKSCyOuhqvo7n+aDyB+XDE1nukGraJObd/lkQBXo9cVEWuUTRdh6pq0BmDqmpQNR0XvH4gz8fOBVJiNF3HXCiMhQhFjccNt2vtfICV2F1blW7Dk29fdLszVWlBqNotYaxmTMy/VzoXSPGMAsi4XsQMmq5jIRLFQiTVCE0SUz67KAiQpewuilF0XUcwErUtU5Vu8ZlprfhyCACvR4ZLsvbRMyKI5cxTCUGa32pzgRSJRJVuRZdGYIFI0qiatiZwdkkiZCk1ZyCJQsa12ctRVHXpIdG01GpAq4NxAoDmCL5XIwoUXo+c17oYIe0qabqOZFLNK4jVXJKMLUXgQbpFvPj1R34BOLfDbimhhEIUMndSz4RVKdy0lVBUDaqqoZjGp/+9djtuCvkTJFwgFvLi1x/eA0aOgZDWUo/FSlKWgkKgxkWRxiWJcMtSwVZD03UoigZFVaFq1mTcLkm1S/sW5oMLxAZe+NrDzwB0gBDUl3oshRAnAmpIKq6glBaUZRIohcftKmhuI20pUn3GrE9DG7UeABeIbfz1U1/yJzVpkBDkXrJWBgSpCwuCCx/LfnzgbkSCivDrSfzz+BQ6ksYarC0nvX7DrLAUVUMiqdi67+PbciP+j2eL4eO5QGzm+199uIMScpSB9JSXRWEjBBj5hW9b/TnvpqPZjjIjlELcKZ0xJJMqEknFdKBtlglBxnFfKxLEuFXjAnGQxRilx3GxMHaVgYwSsLM6Y6NP/+1Pz6ffan3uue8SQrIKJI3MNHwhMYtdiRm42Uq3pxB3StU0JJKqYzVgcUJx3Ndq2LVKwwVSIl782h+3gGidBKSTgdQD6EbxqeJRgM0TYAQACCEjAlFGv/HSz7J+/bc+99wnxERSQWYa7lVC2JWYwVYtYTo7paga4omkLbFFNgoVB8AFUla8+LU/bqGUteo6ayUErbmOZQxXKSVXAUDXydVv/s0/jJm93539/R0QhIK3gWhv8GInIuicyb8hTSmEAaTcqtM1dxiaFMwEF0gV0/qtbz1DgGOmThIESI2NkLdsAVmsRnarqb3/uiYvr+maXiphAOYD8kzwmfTqps/ogdTjgWvLFkj1a0OnuChhdGMzRjc2Y0s0iK7Jy2ib+xR6OGxrRioTcUJx3lWPd+TGgq3GcrgFqVLufP75FrDcW9GJfj8Enw+i3w8qmyss3HLtMrZev4w2ZQFbNGd6+r4tN+J1d5OpLFU+uAWpUpiud69eC049HlCPB+KiKEgBC7rUUAiJ8XF8FIvhI3cTXnc3wa8nca8SgpvpaFEjaFGtqyYeE70476rHey57koJcIFWKvG1bDzQN1OMBEQSItcX1EdaiUSTGx6GF1zabC1IX3pE3LP7UtJQJq9cVbNbicDPNsGjGRC/mqYRLUi3GxBpLrUUmuItVhWw/dcrvI8SS7bD1RAKJiQmos7NWXK7s4BakCvFR2oMiZ62ZqiIxMQFlasqiUZUnXCBVCNP1nkzbJxslOTmJxMTEmgYH6xHuYlUZxbhXaiiEeCAAViXbXQPcglQdPhNzH2mYqiI+Pu5YnLG5vg6yS8Lm+jqIlGL0SgCxZGm65HOBVB99Rg9kqork1BSSU1OOuFOb6+rw+ENfhOxN1XbVudyok9149Aufxw9H3sT5sWu2j2E1zjcj4pSM+4aGWgTgPxs5Vg2FELtyBVowiGIDeiPctakJLz7eiwhTEJiZxQefjGN8eg5NdXXY4KtBV9tdCEaiGJuesX0sy+EWpIqQNK0HeYJzpqqIBwKpLoMO8hd/9BBkl4SPJyfxN//4+tLrPzn3Hg527cSfdu3E0w9/CdOhMD64/qlj4yqPBrEcp+jL9aYaCiFy6ZLj4rhrUxM6m+/ARGgBJ37+5pr3T731Ll55/U0IhOBg105Hx8YFUiXcNzTUkm2/d6aqiF25gtjHH5ckQ9XRnGqgcPnmJBJZFlD9/T+NIhJLYFdrq4Mj4wKpGiRNy7g2XpmZQfjCBcetxnJ8i4WQY5O544uJ4AJcgoiOO7Y5MSwAPAapJvqW/+B06tYIW/x1pR7CGrhAqoD7h4c7oGlL7pUyP494IFCymfDNdXUrxBBOpMrhN/v9Oc/pXHTFzl+7bu8Al8EFUgVQTesDSl8/ddemJvzFHz209KCvJtvrNbKMf79vDwBg6N1zto0vE7zUpIQ8+oV79zBCeggjnSCZGzYwsKsEuLriNUbmAX2ECfTs8Ju/y7sW/XOnTn2ixWKt8UAAeqw021LftakJLz3554aOHQ1cw/lAalLQJ8t4+LP3w+d2YzRwDf9u+MeIJJxZgAVwgTjOvi/e10I1HGVAnxWtfxjYIKNkIJtQ7h8e7tBu3BhNjI8Xe6uCqZFl/NevHMTdmzchHI/jL//hH/HLjy4vvd9xxzb8wT13Y//OHRnPD8fjGPr1P+GHv/yVU0NegrtYDnFgx3Y/E+UB6DgKYt03EwHpg4ae/V+4d2Do7UvfW/1+7Pz5PqaUpo4pzR/cczfu3rwJE8Egnnr5+BoLcP7adUwEF7B/5w5MBIM49N/+B+7a1LSU3XIy5lgNT/M6wIEH2nfronwVBHkbtBUCIagnhB7b39X+8ur39GSy5K1P797UBAB45Y1fZXWPbi4s4JU33kQ4nkCNLOPy5BTOX7teUnEAXCC2s7+r/QnGyIgTnRQJSN+jXe3fTv98Z39/h5mmcHaxaTFjdTPLXEutW8b3DvXiSPcfIhpNLFmOcoALxEYOPNC+m4AMOntXMnDggfbdAMAEoeTWAwDGZmcQV5WsadzHu7owPjuLPT94Ef/iM/eh3utxeITZ4QKxiQM7tvt1hsFS3JvpJN0MriwE8s7lTxDXVHy54354l21WWuuW8R969mAhHsfue+7B411dAIBP5y1ZLm8JvNzdJj7TsvlZAlKaB5Rgy7Z/1o7ZrS1/VpL7r2JqIQSPS8Kuu+7EtsYG/GYsAEXT8PUHH8TBnZ+H3+PBxYkJbN+4EX81MoL3rpcu47Yanua1if1d7TKcQvUAAADGSURBVJ8QkNZS3T/q8+N3u/6wVLfPyL/911/GZ7fdjriiYOTCJZx99zeodbvxX/bvBwA8OfhKiUe4Fi4QG9i7q61DoIU3hbaKCzsfQqy2jLYkAdDRcgf+vPuLcEkixoPzOHf5Kl5//xI21NTg0/nSFUxmg8+D2AAl5bGZZ/30jbITyPmxa/jWq0PY3JAK2BNJBQlFLUtxAFwgtkAIKYunsnZuGjfuLPUo1pJQVATylLaXCzyLZQOMZV6Y5DS189OlHkLF8/8B9VKQCMKNjrkAAAAASUVORK5CYII=";
      img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbkAAAG5CAIAAACcNt1/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBM0FDNDg3RDlGRUQxMUU0OTA2NEZENTlBOUE5MEMyRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBM0FDNDg3RTlGRUQxMUU0OTA2NEZENTlBOUE5MEMyRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkEzQUM0ODdCOUZFRDExRTQ5MDY0RkQ1OUE5QTkwQzJFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkEzQUM0ODdDOUZFRDExRTQ5MDY0RkQ1OUE5QTkwQzJFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+XLGbqgAAgi9JREFUeNrsXQd4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";
      data = {
        id: this.id,
        img: img,
        url: this.img.attr('src'),
        owner: this.owner
      };
      //alert(this.canvas[0].toDataURL());
      //alert(this.id); //519004284812813
      //alert(this.img.attr('src')); //https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-ash2/v/t1.0-9/431818_519004284812813_303093051_n.png?oh=85548a919caa7a4e417586a625ede4cc&oe=55631A03&__gda__=1431257570_a00e8415d5cdc309b5c3bc06136344b5
      //alert(this.owner);//387095654670344

      error = function(XHR, err) {
        return console.log("There was an error posting to server " + err);
      };
      return $.ajax({
        type: 'POST',
        url: "" + fbg.host + "setImage",
        data: data,
        error: error
      });
    };

    FbgCanvas.prototype.addToOtherCopies = function(canvasImg) {
      var ctx, height, id, newImage, newImageCanvas, width;
      width = this.img.width();
      height = this.img.height();
      if (this.img.hasClass('hasGraffiti')) {
        newImageCanvas = $('<canvas>').attr({
          width: width,
          height: height
        });
        ctx = newImageCanvas[0].getContext('2d');
        ctx.drawImage(this.canvas[0], 0, 0, width, height);
        newImage = newImageCanvas[0].toDataURL();
        fbg.cache.add(this.id, newImage);
        return $(".img" + this.id).not('.spotlight').each(function() {
          var img;
          img = $(this);
          return img.attr({
            src: newImage
          });
        });
      } else {
        fbg.cache.add(this.id, canvasImg);
        id = this.id;
        return $(document.body).find('img').not('.hasGraffiti').not('.spotlight').each(function() {
          var img, _id;
          img = $(this);
          _id = fbg.urlParser.id(this.src);
          if (!_id) {
            return;
          }
          if (_id[1] === id) {
            return new fbg.FbgImg(img, id, canvasImg);
          }
        });
      }
    };

    FbgCanvas.prototype.createImgCopy = function() {
      var copy, src;
      src = this.img[0].src;
      copy = new Image;
      copy.crossOrigin = "Anonymous";
      copy.onload = (function(_this) {
        return function() {
          var buffer;
          buffer = document.createElement('canvas');
          buffer.width = _this.img.width();
          buffer.height = _this.img.height();
          _this.ctxCopy = buffer.getContext("2d");
          return _this.ctxCopy.drawImage(copy, 0, 0, _this.img.width(), _this.img.height());
        };
      })(this);
      return copy.src = src;
    };

    FbgCanvas.prototype.getColor = function(x, y) {
      var a, b, g, r, _ref, _ref1;
      _ref = this.ctx.getImageData(x, y, 1, 1).data, r = _ref[0], g = _ref[1], b = _ref[2], a = _ref[3];
      if (a === 255) {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
      _ref1 = this.ctxCopy.getImageData(x, y, 1, 1).data, r = _ref1[0], g = _ref1[1], b = _ref1[2], a = _ref1[3];
      return "rgb(" + r + ", " + g + ", " + b + ")";
    };

    return FbgCanvas;

  })();

}).call(this);
(function() {
  var FbgImg;

  FbgImg = (function() {
    function FbgImg(img, key, url) {
      var css, domElem;
      img.addClass('hasGraffiti');
      css = {
        position: 'absolute',
        'z-index': 3
      };
      img.parent().css({
        'overflow': 'hidden'
      });
      css.left = img.css('left');
      if (img.css('top') !== '0px') {
        css.top = img.css('top');
      }
      if (img.css('marginLeft') !== '0px') {
        css.marginLeft = img.css('marginLeft');
      }
      if (img.css('marginTop') !== '0px') {
        css.marginTop = img.css('marginTop');
      }
      domElem = $('<img>').addClass('img' + key).css(css).load(function(e) {
        img.parent().prepend($(this));
        if (img.hasClass('profilePic')) {
          if ($(this).css('height') > $(this).css('width')) {
            return $(this).css('width', img.outerWidth());
          } else {
            $(this).css('height', img.outerHeight());
            return $(this).css('left', (img.outerWidth() - $(this).width()) / 2);
          }
        } else {
          return $(this).css('width', img.outerWidth());
        }
      }).error(function(e) {
        img.removeClass('hasGraffiti');
        return fbg.cache.doesntExist(key);
      }).attr({
        src: url
      });
    }

    return FbgImg;

  })();

  if (window.fbg == null) {
    window.fbg = {};
  }

  window.fbg.FbgImg = FbgImg;

}).call(this);
(function() {
  var ImageCache;

  ImageCache = (function() {
    function ImageCache() {
      this.forced = {};
      this.local = {};
    }

    ImageCache.prototype["break"] = function(id) {
      this.forced[id] = true;
      return localStorage.setItem("fbgEmpty:" + id, null);
    };

    ImageCache.prototype.add = function(id, url) {
      return this.local[id] = url;
    };

    ImageCache.prototype.doesntExist = function(id) {
      return localStorage.setItem("fbgEmpty:" + id, Math.floor(Date.now() / 1000));
    };

    ImageCache.prototype.past24Hours = function(t) {
      return t > (Math.floor(Date.now() / 1000)) - 24 * 60 * 60;
    };

    ImageCache.prototype.idToUrl = function(id) {
      var isEmpty, q, s3Url;
      s3Url = "https://s3.amazonaws.com/facebookGraffiti/";
      isEmpty = localStorage.getItem("fbgEmpty:" + id);
      if (this.local[id] != null) {
        return this.local[id];
      }
      if ((isEmpty != null) && this.past24Hours(isEmpty)) {
        return null;
      }
      if (this.forced[id]) {
        q = "?dummy=" + ((Math.random() + '').substr(2));
        this.forced[id] = false;
      }
      return "" + s3Url + id + ".png" + (q || '');
    };

    return ImageCache;

  })();

  if (window.fbg == null) {
    window.fbg = {};
  }

  window.fbg.ImageCache = ImageCache;

}).call(this);
(function() {
  var convertAllImages, trackChanges;

  if (fbg.host == null) {
    fbg.host = 'https://fb-graffiti.com/';
  }

  fbg.imgHost = 'http://fbgraffiti.com/extensionimages/';

  fbg.drawing = false;

  fbg.showGraffiti = true;

  fbg.urlParser = {
    userImage: function(src) {
      return src.match(/(profile).*\/[0-9]+_([0-9]+)_[0-9]+/);
    },
    userContent: function(src) {
      return src.match(/(sphotos|scontent).*\/[0-9]+_([0-9]+)_[0-9]+/);
    },
    photoPage: function(src) {
      return src.match(/www.facebook.com\/photo.php?/) || src.match(/www.facebook.com\/.*\/photos/);
    },
    id: function(src) {
      return src.match(/\/[0-9]+_([0-9]+)_[0-9]+/);
    },
    stupidCroppedPhoto: function(src) {
      return src.match(/p\d+x\d+/);
    },
    myId: function() {
      var s;
      s = $("img[id^=profile_pic_header]")[0].id;
      return s != null ? s.match(/_([0-9]+)/)[1] : void 0;
    },
    owner: function(url) {
      var a, b;
      a = url.match(/t\.([0-9]+)/);
      b = url.match(/[0-9]+\.[0-9]+\.([0-9]+)/);
      return (a && a[1]) || (b && b[1]) || null;
    }
  };

  fbg.get = {
    mainImg: function() {
      return $('.spotlight');
    },
    faceBoxes: function() {
      return $('.faceBox');
    },
    photoUi: function() {
      return $('.stageActions, .faceBox, .highlightPager');
    },
    owner: function() {
      var ownerId, url, _ref;
      url = (_ref = $('#fbPhotoSnowliftAuthorName').children().data()) != null ? _ref.hovercard : void 0;
      if (url == null) {
        return null;
      }
      ownerId = url.match(/id=([0-9]+)/);
      if (ownerId == null) {
        return null;
      }
      return ownerId[1];
    }
  };

  fbg.isCoverPhoto = function(img) {
    return img.parent().parent().attr('id') === 'fbProfileCover';
  };

  fbg.onPageLoad = function() {
    var id, mainImg, onNewPage, onPhotoPage, url, _ref;
    onNewPage = location.href !== fbg.currentPage;
    onPhotoPage = fbg.urlParser.photoPage(location.href) != null;
    fbg.currentPage = location.href;
    if (onNewPage) {
      if (typeof fbg !== "undefined" && fbg !== null) {
        if ((_ref = fbg.canvas) != null) {
          _ref.remove();
        }
      }
      if (onPhotoPage) {
        fbg.get.faceBoxes().hide();
        mainImg = fbg.get.mainImg();
        id = fbg.urlParser.userContent(mainImg[0].src)[2];
        fbg.cache["break"](id);
        url = fbg.cache.idToUrl(id);
        fbg.canvas = new fbg.FbgCanvas(mainImg, id, url);
        fbg.canvas.addTo($('.stage'));
        return fbg.drawTools.show();
      } else {
        return fbg.drawTools.hide();
      }
    } else {
      return convertAllImages(document.body);
    }
  };

  trackChanges = function() {
    var domCoolTest;
    domCoolTest = new fbg.DomCoolTest(fbg.onPageLoad, 300);
    return $(document).on("DOMSubtreeModified", domCoolTest.warm);
  };

  convertAllImages = function(base) {
    return $(base).find('img').not('.hasGraffiti').not('.spotlight').each(function() {
      var id, img, url;
      id = fbg.urlParser.id(this.src);
      img = $(this);
      if (id == null) {
        return;
      }
      id = id[1];
      url = fbg.cache.idToUrl(id);
      if (url === null) {
        return;
      }
      return new fbg.FbgImg(img, id, url);
    });
  };

  $(function() {
    fbg.mouse = new EventEmitter();
    fbg.drawTools = new fbg.DrawTools();
    $(window).resize(function() {
      var _ref;
      return (_ref = fbg.canvas) != null ? _ref.resize() : void 0;
    });
    fbg.mouse.addListener('mousemove', (function(_this) {
      return function(options) {
        var _ref;
        if (fbg.drawing && options.onCanvas && options.dragging) {
          return (_ref = fbg.canvas) != null ? _ref.draw(options) : void 0;
        }
      };
    })(this));
    return fbg.mouse.addListener('mousedown', (function(_this) {
      return function(options) {
        var _ref;
        console.log('recieved mousedown', options);
        if (fbg.drawing && options.onCanvas) {
          return (_ref = fbg.canvas) != null ? _ref.saveState() : void 0;
        }
      };
    })(this));
  });

  fbg.cache = new fbg.ImageCache();

  fbg.currentPage = location.href;

  fbg.onPageLoad();

  trackChanges();

}).call(this);
(function() {
  var currX, currY, dragging, onMouse, prevX, prevY;

  prevX = 0;

  currX = 0;

  prevY = 0;

  currY = 0;

  dragging = null;

  document.addEventListener("mousemove", (function(e) {
    return onMouse('move', e);
  }), false);

  document.addEventListener("mousedown", (function(e) {
    return onMouse('down', e);
  }), false);

  document.addEventListener("mouseup", (function(e) {
    return onMouse('up', e);
  }), false);

  document.addEventListener("mouseout", (function(e) {
    return onMouse('out', e);
  }), false);

  if (window.fbg == null) {
    window.fbg = {};
  }

  onMouse = function(eventType, e) {
    var onCanvas, options;
    if (!fbg.canvas) {
      return;
    }
    onCanvas = e.target === fbg.canvas.canvas[0];
    if (eventType === 'down') {
      prevX = currX;
      prevY = currY;
      currX = e.offsetX;
      currY = e.offsetY;
      dragging = true;
      options = {
        currX: currX,
        currY: currY,
        prevX: prevX,
        prevY: prevY,
        onCanvas: onCanvas
      };
      fbg.mouse.emitEvent('mousedown', [options]);
    }
    if (dragging && eventType === 'up' || dragging && eventType === "out") {
      fbg.mouse.emitEvent('mouseup', [
        {
          dragging: dragging
        }
      ]);
      dragging = false;
    }
    if (eventType === 'move') {
      prevX = currX;
      prevY = currY;
      currX = e.offsetX;
      currY = e.offsetY;
      options = {
        currX: currX,
        currY: currY,
        prevX: prevX,
        prevY: prevY,
        onCanvas: onCanvas,
        dragging: dragging
      };
      return fbg.mouse.emitEvent('mousemove', [options]);
    }
  };

}).call(this);
(function() {
  $(function() {
    var countBox, countText, data, flyout, id, iframeCss, jewel, jewelButton, jewelSrc, jewelSrcWhite, lastLogin, left, myPhotos, parent, picker, visible, width;
    data = {};
    parent = $('.notifCentered');
    jewelSrc = fbg.imgHost + 'sprayIcon.png';
    jewelSrcWhite = fbg.imgHost + 'sprayIconWhite.png';
    visible = false;
    jewelButton = $('<div>').addClass('_4962');
    jewel = $('<img />', {
      src: jewelSrc
    });
    jewelButton.append(jewel);
    countBox = $('<div />').css({
      position: 'absolute',
      top: -4,
      left: 20,
      'background-color': 'red',
      height: 20,
      'border-radius': 3,
      display: 'none'
    });
    countText = $('<p>3</p>').css({
      color: 'white',
      margin: 4
    });
    countBox.append(countText);
    jewelButton.append(countBox);
    width = 430;
    left = -200;
    flyout = $('<div>').attr({}).css({
      'z-index': 10,
      position: 'absolute',
      'margin-top': 3
    }).hide();
    picker = $('<div><h1>Graffiti on your photos.</h1></div>').css({
      position: 'relative',
      left: left,
      width: width,
      'background-color': 'white',
      'z-index': 11,
      'border-left-style': 'solid',
      'border-color': 'grey',
      'border-width': 2
    }).appendTo(flyout);
    iframeCss = {
      width: width,
      height: 500,
      position: 'relative',
      left: left,
      'background-color': 'white',
      'border-top-style': 'none'
    };
    myPhotos = $('<iframe />', {
      src: fbg.host + 'browse?u=' + fbg.urlParser.myId()
    }).css(iframeCss).appendTo(flyout);
    jewelButton.append(flyout);
    parent.prepend(jewelButton);
    $('#myG').click(function() {
      myPhotos.show();
      return global.hide();
    });
    $('#globalG').click(function() {
      myPhotos.hide();
      return global.show();
    });
    jewelButton.click(function() {
      countBox.hide();
      if (visible) {
        jewel.attr({
          src: jewelSrc
        });
        flyout.hide();
      } else {
        jewel.attr({
          src: jewelSrcWhite
        });
        flyout.show();
      }
      return visible = !visible;
    });
    $('.jewelButton').click(function() {
      jewelButton.attr({
        src: jewelSrc
      });
      return flyout.hide();
    });
    console.log('Last login', localStorage.getItem("FbgLastLogin"));
    lastLogin = localStorage.getItem("FbgLastLogin");
    localStorage.setItem("FbgLastLogin", new Date());
    if (lastLogin != null) {
      lastLogin = lastLogin != null ? lastLogin.split(' ').join('_') : void 0;
      id = fbg.urlParser.myId();
      return $.get("" + fbg.host + "notifCount?id=" + id + "&last=" + lastLogin, function(data) {
        if (parseInt(data) > 0) {
          countText.text(data);
          return countBox.show();
        }
      });
    }
  });

}).call(this);

/*
Spectrum Colorpicker v1.5.2
https://github.com/bgrins/spectrum
Author: Brian Grinstead
License: MIT
 */

(function() {
  var node, style;

  style = "\n#dropper {\n    border-style: solid;\n    width: 32px;\n    height: 32px;\n    border-color: white;\n    border-width : 1px;\n}\n\n# #dropper:hover {\n#     border-color: black;\n# }\n\n#dropper:active {\n    border-color: black;\n}\n\n.sp-container {\n    position:absolute;\n    top:0;\n    left:0;\n    display:inline-block;\n    *display: inline;\n    *zoom: 1;\n    /* https://github.com/bgrins/spectrum/issues/40 */\n    z-index: 9999994;\n    overflow: hidden;\n}\n.sp-container.sp-flat {\n    position: relative;\n}\n\n/* Fix for * { box-sizing: border-box; } */\n.sp-container,\n.sp-container * {\n    -webkit-box-sizing: content-box;\n       -moz-box-sizing: content-box;\n            box-sizing: content-box;\n}\n\n/* http://ansciath.tumblr.com/post/7347495869/css-aspect-ratio */\n.sp-top {\n  position:relative;\n  width: 100%;\n  display:inline-block;\n}\n.sp-top-inner {\n   position:absolute;\n   top:0;\n   left:0;\n   bottom:0;\n   right:0;\n}\n.sp-color {\n    position: absolute;\n    top:0;\n    left:0;\n    bottom:0;\n    right:20%;\n}\n.sp-hue {\n    position: absolute;\n    top:0;\n    right:0;\n    bottom:0;\n    left:84%;\n    height: 100%;\n}\n\n.sp-clear-enabled .sp-hue {\n    top:33px;\n    height: 77.5%;\n}\n\n.sp-fill {\n    padding-top: 80%;\n}\n.sp-sat, .sp-val {\n    position: absolute;\n    top:0;\n    left:0;\n    right:0;\n    bottom:0;\n}\n\n.sp-alpha-enabled .sp-top {\n    margin-bottom: 18px;\n}\n.sp-alpha-enabled .sp-alpha {\n    display: block;\n}\n.sp-alpha-handle {\n    position:absolute;\n    top:-4px;\n    bottom: -4px;\n    width: 6px;\n    left: 50%;\n    cursor: pointer;\n    border: 1px solid black;\n    background: white;\n    opacity: .8;\n}\n.sp-alpha {\n    display: none;\n    position: absolute;\n    bottom: -14px;\n    right: 0;\n    left: 0;\n    height: 8px;\n}\n.sp-alpha-inner {\n    border: solid 1px #333;\n}\n\n.sp-clear {\n    display: none;\n}\n\n.sp-clear.sp-clear-display {\n    background-position: center;\n}\n\n.sp-clear-enabled .sp-clear {\n    display: block;\n    position:absolute;\n    top:0px;\n    right:0;\n    bottom:0;\n    left:84%;\n    height: 28px;\n}\n\n/* Dont allow text selection */\n.sp-container, .sp-replacer, .sp-preview, .sp-dragger, .sp-slider, .sp-alpha, .sp-clear, .sp-alpha-handle, .sp-container.sp-dragging .sp-input, .sp-container button  {\n    -webkit-user-select:none;\n    -moz-user-select: -moz-none;\n    -o-user-select:none;\n    user-select: none;\n}\n\n.sp-container.sp-input-disabled .sp-input-container {\n    display: none;\n}\n.sp-container.sp-buttons-disabled .sp-button-container {\n    display: none;\n}\n.sp-container.sp-palette-buttons-disabled .sp-palette-button-container {\n    display: none;\n}\n.sp-palette-only .sp-picker-container {\n    display: none;\n}\n.sp-palette-disabled .sp-palette-container {\n    display: none;\n}\n\n.sp-initial-disabled .sp-initial {\n    display: none;\n}\n\n\n/* Gradients for hue, saturation and value instead of images.  Not pretty... but it works */\n.sp-sat {\n    background-image: -webkit-gradient(linear,  0 0, 100% 0, from(#FFF), to(rgba(204, 154, 129, 0)));\n    background-image: -webkit-linear-gradient(left, #FFF, rgba(204, 154, 129, 0));\n    background-image: -moz-linear-gradient(left, #fff, rgba(204, 154, 129, 0));\n    background-image: -o-linear-gradient(left, #fff, rgba(204, 154, 129, 0));\n    background-image: -ms-linear-gradient(left, #fff, rgba(204, 154, 129, 0));\n    background-image: linear-gradient(to right, #fff, rgba(204, 154, 129, 0));\n    -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr=#FFFFFFFF, endColorstr=#00CC9A81)\";\n    filter : progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr='#FFFFFFFF', endColorstr='#00CC9A81');\n}\n.sp-val {\n    background-image: -webkit-gradient(linear, 0 100%, 0 0, from(#000000), to(rgba(204, 154, 129, 0)));\n    background-image: -webkit-linear-gradient(bottom, #000000, rgba(204, 154, 129, 0));\n    background-image: -moz-linear-gradient(bottom, #000, rgba(204, 154, 129, 0));\n    background-image: -o-linear-gradient(bottom, #000, rgba(204, 154, 129, 0));\n    background-image: -ms-linear-gradient(bottom, #000, rgba(204, 154, 129, 0));\n    background-image: linear-gradient(to top, #000, rgba(204, 154, 129, 0));\n    -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#00CC9A81, endColorstr=#FF000000)\";\n    filter : progid:DXImageTransform.Microsoft.gradient(startColorstr='#00CC9A81', endColorstr='#FF000000');\n}\n\n.sp-hue {\n    background: -moz-linear-gradient(top, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n    background: -ms-linear-gradient(top, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n    background: -o-linear-gradient(top, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n    background: -webkit-gradient(linear, left top, left bottom, from(#ff0000), color-stop(0.17, #ffff00), color-stop(0.33, #00ff00), color-stop(0.5, #00ffff), color-stop(0.67, #0000ff), color-stop(0.83, #ff00ff), to(#ff0000));\n    background: -webkit-linear-gradient(top, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n    background: linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);\n}\n\n/* IE filters do not support multiple color stops.\n   Generate 6 divs, line them up, and do two color gradients for each.\n   Yes, really.\n */\n.sp-1 {\n    height:17%;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff0000', endColorstr='#ffff00');\n}\n.sp-2 {\n    height:16%;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffff00', endColorstr='#00ff00');\n}\n.sp-3 {\n    height:17%;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ff00', endColorstr='#00ffff');\n}\n.sp-4 {\n    height:17%;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffff', endColorstr='#0000ff');\n}\n.sp-5 {\n    height:16%;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0000ff', endColorstr='#ff00ff');\n}\n.sp-6 {\n    height:17%;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff00ff', endColorstr='#ff0000');\n}\n\n.sp-hidden {\n    display: none !important;\n}\n\n/* Clearfix hack */\n.sp-cf:before, .sp-cf:after { content: \"\"; display: table; }\n.sp-cf:after { clear: both; }\n.sp-cf { *zoom: 1; }\n\n/* Mobile devices, make hue slider bigger so it is easier to slide */\n@media (max-device-width: 480px) {\n    .sp-color { right: 40%; }\n    .sp-hue { left: 63%; }\n    .sp-fill { padding-top: 60%; }\n}\n.sp-dragger {\n   border-radius: 5px;\n   height: 5px;\n   width: 5px;\n   border: 1px solid #fff;\n   background: #000;\n   cursor: pointer;\n   position:absolute;\n   top:0;\n   left: 0;\n}\n.sp-slider {\n    position: absolute;\n    top:0;\n    cursor:pointer;\n    height: 3px;\n    left: -1px;\n    right: -1px;\n    border: 1px solid #000;\n    background: white;\n    opacity: .8;\n}\n\n/*\nTheme authors:\nHere are the basic themeable display options (colors, fonts, global widths).\nSee http://bgrins.github.io/spectrum/themes/ for instructions.\n*/\n\n.sp-container {\n    border-radius: 0;\n    background-color: #ECECEC;\n    border: solid 1px #f0c49B;\n    padding: 0;\n}\n.sp-container, .sp-container button, .sp-container input, .sp-color, .sp-hue, .sp-clear {\n    font: normal 12px \"Lucida Grande\", \"Lucida Sans Unicode\", \"Lucida Sans\", Geneva, Verdana, sans-serif;\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    -ms-box-sizing: border-box;\n    box-sizing: border-box;\n}\n.sp-top {\n    margin-bottom: 3px;\n}\n.sp-color, .sp-hue, .sp-clear {\n    border: solid 1px #666;\n}\n\n/* Input */\n.sp-input-container {\n    float:right;\n    width: 100px;\n    margin-bottom: 4px;\n}\n.sp-initial-disabled  .sp-input-container {\n    width: 100%;\n}\n.sp-input {\n   font-size: 12px !important;\n   border: 1px inset;\n   padding: 4px 5px;\n   margin: 0;\n   width: 100%;\n   background:transparent;\n   border-radius: 3px;\n   color: #222;\n}\n.sp-input:focus  {\n    border: 1px solid orange;\n}\n.sp-input.sp-validation-error {\n    border: 1px solid red;\n    background: #fdd;\n}\n.sp-picker-container , .sp-palette-container {\n    float:left;\n    position: relative;\n    padding: 10px;\n    padding-bottom: 300px;\n    margin-bottom: -290px;\n}\n.sp-picker-container {\n    width: 172px;\n    border-left: solid 1px #fff;\n}\n\n/* Palettes */\n.sp-palette-container {\n    border-right: solid 1px #ccc;\n}\n\n.sp-palette-only .sp-palette-container {\n    border: 0;\n}\n\n.sp-palette .sp-thumb-el {\n    display: block;\n    position:relative;\n    float:left;\n    width: 24px;\n    height: 15px;\n    margin: 3px;\n    cursor: pointer;\n    border:solid 2px transparent;\n}\n.sp-palette .sp-thumb-el:hover, .sp-palette .sp-thumb-el.sp-thumb-active {\n    border-color: orange;\n}\n.sp-thumb-el {\n    position:relative;\n}\n\n/* Initial */\n.sp-initial {\n    float: left;\n    border: solid 1px #333;\n}\n.sp-initial span {\n    width: 30px;\n    height: 25px;\n    border:none;\n    display:block;\n    float:left;\n    margin:0;\n}\n\n.sp-initial .sp-clear-display {\n    background-position: center;\n}\n\n/* Buttons */\n.sp-palette-button-container,\n.sp-button-container {\n    float: right;\n}\n\n/* Replacer (the little preview div that shows up instead of the <input>) */\n.sp-replacer {\n    # position: absolute;\n    float: left;\n    z-index: 999;\n    margin:0;\n    overflow:hidden;\n    cursor:pointer;\n    padding: 4px;\n    display:inline-block;\n    *zoom: 1;\n    *display: inline;\n    border: solid 1px #91765d;\n    background: #eee;\n    color: #333;\n    vertical-align: middle;\n}\n.sp-replacer:hover, .sp-replacer.sp-active {\n    border-color: #F0C49B;\n    color: #111;\n}\n.sp-replacer.sp-disabled {\n    cursor:default;\n    border-color: silver;\n    color: silver;\n}\n.sp-dd {\n    padding: 2px 0;\n    height: 16px;\n    line-height: 16px;\n    float:left;\n    font-size:10px;\n}\n.sp-preview {\n    position:relative;\n    width:25px;\n    height: 20px;\n    border: solid 1px #222;\n    margin-right: 5px;\n    float:left;\n    z-index: 0;\n}\n\n.sp-palette {\n    *width: 220px;\n    max-width: 220px;\n}\n.sp-palette .sp-thumb-el {\n    width:16px;\n    height: 16px;\n    margin:2px 1px;\n    border: solid 1px #d0d0d0;\n}\n\n.sp-container {\n    padding-bottom:0;\n}\n\n\n/* Buttons: http://hellohappy.org/css3-buttons/ */\n.sp-container button {\n  background-color: #eeeeee;\n  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);\n  background-image: linear-gradient(to bottom, #eeeeee, #cccccc);\n  border: 1px solid #ccc;\n  border-bottom: 1px solid #bbb;\n  border-radius: 3px;\n  color: #333;\n  font-size: 14px;\n  line-height: 1;\n  padding: 5px 4px;\n  text-align: center;\n  text-shadow: 0 1px 0 #eee;\n  vertical-align: middle;\n}\n.sp-container button:hover {\n    background-color: #dddddd;\n    background-image: -webkit-linear-gradient(top, #dddddd, #bbbbbb);\n    background-image: -moz-linear-gradient(top, #dddddd, #bbbbbb);\n    background-image: -ms-linear-gradient(top, #dddddd, #bbbbbb);\n    background-image: -o-linear-gradient(top, #dddddd, #bbbbbb);\n    background-image: linear-gradient(to bottom, #dddddd, #bbbbbb);\n    border: 1px solid #bbb;\n    border-bottom: 1px solid #999;\n    cursor: pointer;\n    text-shadow: 0 1px 0 #ddd;\n}\n.sp-container button:active {\n    border: 1px solid #aaa;\n    border-bottom: 1px solid #888;\n    -webkit-box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee;\n    -moz-box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee;\n    -ms-box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee;\n    -o-box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee;\n    box-shadow: inset 0 0 5px 2px #aaaaaa, 0 1px 0 0 #eeeeee;\n}\n.sp-cancel {\n    font-size: 11px;\n    color: #d93f3f !important;\n    margin:0;\n    padding:2px;\n    margin-right: 5px;\n    vertical-align: middle;\n    text-decoration:none;\n\n}\n.sp-cancel:hover {\n    color: #d93f3f !important;\n    text-decoration: underline;\n}\n\n\n.sp-palette span:hover, .sp-palette span.sp-thumb-active {\n    border-color: #000;\n}\n\n.sp-preview, .sp-alpha, .sp-thumb-el {\n    position:relative;\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);\n}\n.sp-preview-inner, .sp-alpha-inner, .sp-thumb-inner {\n    display:block;\n    position:absolute;\n    top:0;left:0;bottom:0;right:0;\n}\n\n.sp-palette .sp-thumb-inner {\n    background-position: 50% 50%;\n    background-repeat: no-repeat;\n}\n\n.sp-palette .sp-thumb-light.sp-thumb-active .sp-thumb-inner {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIVJREFUeNpiYBhsgJFMffxAXABlN5JruT4Q3wfi/0DsT64h8UD8HmpIPCWG/KemIfOJCUB+Aoacx6EGBZyHBqI+WsDCwuQ9mhxeg2A210Ntfo8klk9sOMijaURm7yc1UP2RNCMbKE9ODK1HM6iegYLkfx8pligC9lCD7KmRof0ZhjQACDAAceovrtpVBRkAAAAASUVORK5CYII=);\n}\n\n.sp-palette .sp-thumb-dark.sp-thumb-active .sp-thumb-inner {\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAMdJREFUOE+tkgsNwzAMRMugEAahEAahEAZhEAqlEAZhEAohEAYh81X2dIm8fKpEspLGvudPOsUYpxE2BIJCroJmEW9qJ+MKaBFhEMNabSy9oIcIPwrB+afvAUFoK4H0tMaQ3XtlrggDhOVVMuT4E5MMG0FBbCEYzjYT7OxLEvIHQLY2zWwQ3D+9luyOQTfKDiFD3iUIfPk8VqrKjgAiSfGFPecrg6HN6m/iBcwiDAo7WiBeawa+Kwh7tZoSCGLMqwlSAzVDhoK+6vH4G0P5wdkAAAAASUVORK5CYII=);\n}\n\n.sp-clear-display {\n    background-repeat:no-repeat;\n    background-position: center;\n    background-image: url(data:image/gif;base64,R0lGODlhFAAUAPcAAAAAAJmZmZ2dnZ6enqKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq/Hx8fLy8vT09PX19ff39/j4+Pn5+fr6+vv7+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAUABQAAAihAP9FoPCvoMGDBy08+EdhQAIJCCMybCDAAYUEARBAlFiQQoMABQhKUJBxY0SPICEYHBnggEmDKAuoPMjS5cGYMxHW3IiT478JJA8M/CjTZ0GgLRekNGpwAsYABHIypcAgQMsITDtWJYBR6NSqMico9cqR6tKfY7GeBCuVwlipDNmefAtTrkSzB1RaIAoXodsABiZAEFB06gIBWC1mLVgBa0AAOw==);\n}";

  node = document.createElement('style');

  node.innerHTML = style;

  document.body.appendChild(node);

}).call(this);