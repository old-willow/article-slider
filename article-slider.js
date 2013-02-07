/*
 * file: article-slider.js
 * maintainer: Kolozsi Róbert <kolozsi.robert@gmail.com>
 * date: Nov 13, 2012
 * last update: Jan 2, 2013
 */

/* This is a prototype project. With time it will probably evolve in to object API.*/


(function(window, undefined) {
    var document = window.document;
    // Container div element (static in page.)
    var container = document.getElementById('container');
    var scroll_div = document.getElementById('scroll_div');
    var art_item;
    var container_height;
    var container_width = container.offsetWidth - 2;  // 2 - stands for 2px for the border of the container.
    var scroll_div_width;
    var scroll_div_height;

    // Navigation placeholders. Used if the number of articles excide 18.
    var left_nav;
    var right_nav;

    var my_top;
    var my_left;  // For positioning article divs.

    // Basic setup of articles.
    var NUMBER_OF_ARTICLES = 84;
    var NUMBER_OF_ROWS = 3;
    var NUMBER_OF_COLUMNS = parseInt(Math.round(NUMBER_OF_ARTICLES / NUMBER_OF_ROWS));
    var GAP = 10;

    /* Check if number of columns correspond to the number of articles.
     * If not then adjust by adding one more column.
    */
    var reminder = NUMBER_OF_ARTICLES % NUMBER_OF_ROWS;
    console.log('reminder: ' + reminder);
    if (reminder === 1) {
        NUMBER_OF_COLUMNS += 1;
    }

    console.log('NUMBER_OF_ARTICLES: ' + NUMBER_OF_ARTICLES);
    console.log('NUMBER_OF_COLUMNS: ' + NUMBER_OF_COLUMNS);

    var art_item_width = 150;
    var art_item_height = 100;

    // Calculate main container height.
    container_height = (NUMBER_OF_ROWS * art_item_height) + ((NUMBER_OF_ROWS + 3) * GAP);
    container.style.height = container_height + "px";

    // Calculate scroll_div width & height.
    scroll_div_width = (NUMBER_OF_COLUMNS * art_item_width) + ((NUMBER_OF_COLUMNS + 1) * GAP);
    scroll_div_height = (NUMBER_OF_ROWS * art_item_height) + ((NUMBER_OF_ROWS + 1) * GAP);
    scroll_div.style.width = scroll_div_width + "px";
    scroll_div.style.height = scroll_div_height + "px";
    console.log("scroll_div_width: " + scroll_div_width);
    var scroll_div_max_movement = scroll_div_width - container_width;
    console.log("scroll_div_max_movement: " + scroll_div_max_movement);

    // Partitioning scroll_div_max_movement in to equal parts, according to max one step movement.
    // max one step movement is currently 2xNUMBER_OF_COLUMNS + 2xGAP.
    var move_limit = 2 * art_item_width + 2 * GAP; // 170px
    var equal_divisor = parseInt(Math.floor(scroll_div_max_movement / move_limit));
    console.log('equal divisor: ' + equal_divisor);
    console.log('move limit: ' + move_limit);
    console.log('equal divisor: ' + equal_divisor);
    move_limit = scroll_div_max_movement / equal_divisor;
    console.log('<recalculated> move limit: ' + move_limit);

    var SAVED_MOVE_LIMIT = move_limit;
    var scroll_reminder = 0;

    container.style.overflowX = 'hidden';


    /* ********************************
     *  Creating and sorting articles.
     * ********************************/
    my_left = GAP / 2;
    var art_counter = 1;
    for (i = 0; i < NUMBER_OF_COLUMNS; i += 1) {
        my_top = GAP / 2;
        for (j = 0; j < NUMBER_OF_ROWS; j += 1) {
            if (art_counter <= NUMBER_OF_ARTICLES) {  // Don't draw the none existing article boxs.
                art_item = document.createElement('div');
                scroll_div.appendChild(art_item);
                art_item.setAttribute('class', 'article_item');
                art_item.innerHTML = art_counter;
                art_counter += 1;

                art_item.style.top = my_top + "px";
                art_item.style.left = my_left + "px";

                my_top += art_item_height + GAP;
            }
        }
        my_left += art_item_width + GAP;
    }


    /* *********************************************
        *  If we have more then 18 articles available.
        *  Then grab the navigations.
        * *********************************************/
    if (scroll_div.children.length > 18) {
        left_nav = document.getElementById('left_nav');
        right_nav = document.getElementById('right_nav');
        slider_bar = document.getElementById('slider_div');
        left_nav.style.height = container_height + "px";
        right_nav.style.height = container_height + "px";

        // Creating slider_bar.
        console.log(container_width);
        var slider_bar_width = ((container_width / scroll_div_width) * container_width);
        slider_bar.style.width = slider_bar_width + "px";
        slider_bar.style.visibility = "visible";

        var scroll_div_x_pos = 0;
        var position = scroll_div.offsetLeft;  // Get the value of the left propterty!
        console.log('position: ' + position);

        /* IMPORTANT!: The sum of the array numbers have to be 100!!! */
        var tween = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        var frames_number = tween.length;
        var timer_id;
        var in_animation = false;
        var frames = [];

        /* **************************************
         *  Definitions of navigation functions.
         * **************************************/
        var up = true,
            move = false;
        var max_slider_movement = container_width - slider_bar_width;
        console.log("slider_width " + slider_bar_width);
        console.log("max_slider_movement " + max_slider_movement);
        var scale_slider_movement = max_slider_movement / (scroll_div_width - container_width);
        var scale_scroll_div_movement = (scroll_div_width - container_width) / max_slider_movement;
        var slider_x_pos = 0;
        var read_x = 0;
        var click_x = 0;
        var diff_x = 0;
        var last_x = 0;

        var slided = false;  // Check if slider is moved. If true have to recalculate move_limit varible!

        var scroll_left = (function() {
            var move_counter = 0;

            return function() {
                if (scroll_div_x_pos > -(scroll_div_max_movement) &&
                    move_counter < tween.length) {

                    if (slided) {
                        /* Recalculate move_limit. */
                        scroll_reminder = scroll_div_max_movement - Math.abs(scroll_div_x_pos);
                        console.log("scroll_reminder: " + scroll_reminder);
                        equal_divisor = parseInt(Math.ceil(scroll_reminder / move_limit));
                        console.log("equal_divisor: " + equal_divisor);
                        if (equal_divisor > 1) {
                            //equal_divisor = parseInt(Math.ceil(equal_divisor));
                            move_limit = scroll_reminder / equal_divisor;
                            console.log("move_limit: " + move_limit);
                        } else if (equal_divisor === 1) {
                            move_limit = scroll_reminder;
                            console.log("move_limit: " + move_limit);
                        }
                        slided = false;
                    }

                    if (!in_animation) {  // Then calculate new positions.
                        position = scroll_div.offsetLeft * -1;
                        console.log('scroll_div.offsetLeft: ', scroll_div.offsetLeft);
                        for (i = 0; i < frames_number; i += 1) {
                            position += (move_limit * tween[i] * 0.01);
                            frames[i] = position;
                        }
                        i = 0;
                        in_animation = true;
                    }

                    scroll_div_x_pos = -frames[move_counter];
                    slider_x_pos = Math.abs(scroll_div_x_pos * scale_slider_movement);
                    console.log("scroll_div_x_pos: " + scroll_div_x_pos);
                    //console.log("slider_x_pos: " + slider_x_pos);
                    scroll_div.style.left = scroll_div_x_pos + "px";
                    slider_bar.style.left = slider_x_pos + "px";
                    //console.log(scroll_div.style.left);
                    move_counter += 1;
                    //console.log("move_counter: " + move_counter);
                    // Recursion.
                    timer_id = setTimeout(scroll_left, 50);

                    if (scroll_div_x_pos <= -(scroll_div_max_movement)) {
                        move_limit = SAVED_MOVE_LIMIT;
                        console.log("saved movelimit!");
                        console.log("move_limit: " + move_limit);
                    }

                } else {
                    console.log("Hey, conditions don't match.");
                    move_counter = 0;
                    in_animation = false;
                    clearTimeout(timer_id);  // Not necessary.
                }
            }
        })();

        var scroll_right = (function() {
            var move_counter = 0;

            return function() {
                if (scroll_div_x_pos < 0 && move_counter < tween.length) {

                    if (slided) {
                        /* Recalculate move_limit. */
                        scroll_reminder = Math.abs(scroll_div_x_pos);
                        console.log("scroll_reminder: " + scroll_reminder);
                        equal_divisor = parseInt(Math.ceil(scroll_reminder / move_limit));
                        console.log(">>>> move_limit: " + move_limit);
                        console.log("equal_divisor: " + equal_divisor);
                        if (equal_divisor > 1) {
                            //equal_divisor = parseInt(Math.ceil(equal_divisor));
                            move_limit = scroll_reminder / equal_divisor;
                            console.log("new move_limit: " + move_limit);
                        } else if (equal_divisor === 1) {
                            move_limit = scroll_reminder;
                            console.log("move_limit: " + move_limit);
                        }
                        slided = false;
                    }

                    if (!in_animation) {  // Then calculate new positions.
                        position = scroll_div.offsetLeft * -1;
                        for (i = 0; i < frames_number; i += 1) {
                            position -= (move_limit * tween[i] * 0.01);
                            frames[i] = position;
                        }
                        in_animation = true;
                    }

                    scroll_div_x_pos = -frames[move_counter];
                    slider_x_pos = -(scroll_div_x_pos * scale_slider_movement);
                    console.log("scroll_div_x_pos: " + scroll_div_x_pos);
                    scroll_div.style.left = scroll_div_x_pos + "px";
                    slider_bar.style.left = slider_x_pos + "px";
                    move_counter += 1;
                    // Recursion.
                    timer_id = setTimeout(scroll_right, 50);

                    if ((scroll_div_x_pos < 0.0 && scroll_div_x_pos > -1.0) ||
                            (scroll_div_x_pos > 0.0 && scroll_div_x_pos < 1.0)) {
                        move_limit = SAVED_MOVE_LIMIT;
                        console.log("saved movelimit!");
                        console.log("move_limit: " + move_limit);
                    }

                } else {
                    console.log("Hey, conditions don't match.");
                    move_counter = 0;
                    in_animation = false;
                    clearTimeout(timer_id);
                }
            }
        })();

        /* This browser approach I found on:
         * http://www.quirksmode.org/js/events_properties.html */
        var slider_mousedown = function(e) {
            /* Function for setup the sliding possibilities.
             * It is attached to the slider_div element. */
            if (!e) {
                var e = window.event;
            }
            slider_div.style.background = '#800000';

            if (e.pageX) {  // Chrome, Opera
                console.log('chrome/opera');
                console.log('mousedown');
                up = false;
                //console.log("up: ", up);
                click_x = e.pageX;
                last_x = click_x;
                console.log('click_x :' + click_x);
            } else if (e.clientX) {  // Firefox!
                console.log('firefox');
                click_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                last_x = click_x;
            }
        };

        var slider_mousemove = function(e) {
            /* This function works only if there was mousedown event on the slider_div element.
             * It is attached to the document element. */
            if (!up) {
                if (!e) {
                    var e = window.event;
                }

                slided = true;

                // Calculating the slider position and moving it also.
                // Moving slider to the RIGHT.
                if (e.pageX) {
                    read_x = e.pageX;
                } else if (e.clientX) {
                    read_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                }
                console.log('read_x :' + read_x);

                if ((read_x > last_x) &&
                    slider_x_pos <= max_slider_movement &&
                    scroll_div_x_pos > -(scroll_div_max_movement)) {

                    diff_x = (read_x - last_x);
                    console.log('diff_x: ' + diff_x);
                    if ((slider_x_pos + diff_x) <= max_slider_movement) {
                        slider_x_pos += diff_x;
                        scroll_div_x_pos = -(slider_x_pos * scale_scroll_div_movement);
                    } else if ((slider_x_pos + diff_x) > max_slider_movement) {
                        slider_x_pos = max_slider_movement;
                        scroll_div_x_pos = -(scroll_div_max_movement);
                    }
                    console.log('moving right: slider_x_pos: ' + slider_x_pos);
                    slider_div.style.left = slider_x_pos + "px";
                    scroll_div.style.left = scroll_div_x_pos + "px";
                    last_x = read_x;

                // Moving slider to the LEFT.
                } else if ((read_x < last_x) &&
                            slider_x_pos >= 0 &&
                            scroll_div_x_pos < 0) {

                    diff_x = (last_x - read_x);
                    console.log('diff_x: ' + diff_x);
                    if ((slider_x_pos - diff_x) >= 0) {
                        slider_x_pos -= diff_x;
                        scroll_div_x_pos = -(slider_x_pos * scale_scroll_div_movement);
                    } else if ((slider_x_pos - diff_x) < 0) {
                        console.log('left zerozero!');
                        slider_x_pos = 0;
                        scroll_div_x_pos = 0;
                    }
                    console.log('moving left: slider_x_pos: ' + slider_x_pos);
                    slider_div.style.left = slider_x_pos + "px";
                    scroll_div.style.left = scroll_div_x_pos + "px";
                    last_x = read_x;
                }
            }
        };

        var slider_mouseup = function(e) {
            /* This function is only executed if there was a mousedown event on
             * slider_div element and ti turned off the: up = false.
             * It is attached to the document element. */
            if (!e) {
                var e = window.event;
            }

            if (!up) {
                up = true;
                click_x = 0;
                last_x = 0;
                diff_x = 0;
                console.log('mouseup');
                slider_div.style.background = '#4c0000';
            }
        }

        /* Selecting element are not possible on this page.
         * This is attached to the document.body element. */
        var preventSelecting = function(e) {
            if (!up) {
                if (!e) {
                    var e = window.event;
                }
                // This part is for canceling selection.
                if ('cancelable' in e) {  // Firefox allways gives true.
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                } else {
                    e.returnValue = false;  // Firefox doesn't support this.
                }
            }
        };

        // Add event listeners to left and right navigatinos.
        left_nav.addEventListener('click', scroll_left, false);
        right_nav.addEventListener('click', scroll_right, false);

        // Slider stuff.
        slider_bar.addEventListener('mousedown', slider_mousedown, false);
        document.addEventListener('mouseup', slider_mouseup, false);
        document.addEventListener('mousemove', slider_mousemove, false);
        document.body.addEventListener('selectstart', preventSelecting, false);

        // Decoration of slider_bar: coloring...
        slider_bar.addEventListener('mouseover', function() {
            slider_bar.style.background = '#800000';
        });
        slider_bar.addEventListener('mouseout', function() {
            if (up) {
                slider_bar.style.background = '#4c0000';
            }
        });
    }

})(window);

// vim: set tw=120:
