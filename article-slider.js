/*
 * file: article-slider.js
 * maintainer: Kolozsi Róbert <robert.kolozsi@gmail.com>
 * date: Nov 13, 2012
 * last milestone: March 21, 2013
 * last update: Aug 23, 2013
 */

/* This is a prototype project. */

/* index.html is the basic html setup for this slider. */


(function(window, undefined) {
    var document = window.document;
    var sliderBar;  // Slider bar navigation slider.
    var upLeftNav, downRightNav;  // Navigation button elements.

    var ASArticle = {
        width: 150 + 10,  // 10 is for border of article item.
        height: 100 + 10,

        /* This value will be acquired dinamically by querying database. */
        nArticles: 7,

        item: null,

        /* ********************************
        *  Creating and sorting articles.
        * ********************************/
        createArticles: function() {
            item = document.createElement('div');
            item.setAttribute('class', 'article_item');

            return item;
       }

    }


    var ASBasic = {
        /* Basic object for setup a slider structure. */
        /* Default setting is a horizontal orientation. */
        orientation: {
            types: ['Horizontal', 'Vertical'],

            current: null,

            setOrientation: function(n) {
                this.current = this.types[n];
            }
        },

        /* Space between two articles (both: horiz, vert)
         * and space between article and scroll_div. */
        gap: 10,

        nRows: 1,  // This is taken into a count only if orientation is horiz.
        nColumns: 2,  // This is taken into a count only if orientation is vert.
        setColumnsRows: function() {
            /* if orientation is horizontal then decide how many rows you want and
             * columns have to be calculated. */
            if (this.orientation.current === 'Horizontal') {
                // Correcting number of columns because they are in dependencies of ASArticle.nArticles and nRows.
                if (ASArticle.nArticles <= this.nRows) {
                    this.nRows = ASArticle.nArticles;
                    this.nColumns = 1;
                } else if (ASArticle.nArticles > this.nRows) {
                    this.nColumns = parseInt(Math.ceil(ASArticle.nArticles / this.nRows));
                }

            /* If orientation is vertical then decide how many columns you want and
             * rows have to be calculated. */
            } else if (this.orientation.current === 'Vertical') {
                // Correcting number of rows because they are in dependencie of number of articles.
                if (ASArticle.nArticles <= this.nColumns) {
                    this.nColumns = ASArticle.nArticles;
                    this.nRows = 1;
                } else if (ASArticle.nArticles > this.nColumns) {
                    this.nRows = parseInt(Math.ceil(ASArticle.nArticles / this.nColumns));
                }

            } else {
                console.log("ERROR: Can't calculate columns or rows for some error accoured!");
            }
        }
    }


    var ASMainContainer = {
        wrapper: null,  // The wrapper div.
        wrapperWidth: 0,
        wrapperHeight: 0,

        /* Main Container. (the main container div) */
        mainContainer: null,
        height: 300,   // This is should be set manualy if orientation is vertical otherwise it's calculated.
        width: 300,    // This is should be set manualy if orientation is horizontal otherwise it's calculated.

        setMainContainer: function() {
            /* If you rename this rename it also in html and css files! */
            this.mainContainer = document.getElementById('main_container');

            if (typeof this.mainContainer !== null) {
                ASBasic.setColumnsRows();

                if (ASBasic.orientation.current === 'Horizontal') {
                    this.mainContainer.setAttribute('class', 'main_container_horizontal');
                    this.height = (ASBasic.nRows * ASArticle.height) +
                        ((ASBasic.nRows - 1) * ASBasic.gap) +
                        (2 * ASBasic.gap);

                    this.mainContainer.style.top = 0 + 'px';
                    this.mainContainer.style.left = 0 + 'px'; //this.width + 'px';

                } else if (ASBasic.orientation.current === 'Vertical') {
                    this.mainContainer.setAttribute('class', 'main_container_vertical');
                    this.width = (ASBasic.nColumns * ASArticle.width) +
                        ((ASBasic.nColumns - 1) * ASBasic.gap) +
                        (2 * ASBasic.gap);

                    this.mainContainer.style.top = ASNavigatorButtons.height + 'px';  // ??? what is this ???
                }

                this.mainContainer.style.overflow = 'hidden';
                this.mainContainer.style.width = this.width + 'px';
                this.mainContainer.style.height = this.height + 'px';

            } else {
                console.log("ERROR: You didn't named id properly or you don't have any main container element in html file.");
            }
        },

        getMainContainer: function() {
            return this.mainContainer;
        },

        setArticleSlider: function() {
            this.setMainContainer();
            ASScrollingDiv.setScrollingDiv();
        }
    }


    var ASScrollingDiv = {
        width: 0,
        height: 0,

        scrollingDiv: null,

        setScrollingDiv: function() {
            this.scrollingDiv = document.getElementById('scrolling_div');

            if (typeof this.scrollingDiv !== null) {
                this.width = (ASBasic.nColumns * ASArticle.width) + ((ASBasic.nColumns - 1) * ASBasic.gap);
                this.height = (ASBasic.nRows * ASArticle.height) + ((ASBasic.nRows - 1) * ASBasic.gap);
                //console.log("Slider Width: " + this.width);
                //console.log("Slider Height: " + this.height);

                this.scrollingDiv.style.width = this.width + 'px';
                this.scrollingDiv.style.height = this.height + 'px';

                if (ASBasic.orientation.current === 'Horizontal') {
                    this.scrollingDiv.style.left = 0 + 'px';
                    this.scrollingDiv.style.top = ASBasic.gap + 'px';
                } else if (ASBasic.orientation.current === 'Vertical') {
                    this.scrollingDiv.style.top = 0 + 'px';
                    this.scrollingDiv.style.left = ASBasic.gap + 'px';
                }

                this.distributeArticles();

            } else {
                console.log("ERROR: You didn't named id properly or don't have any slide container element in html file.");
            }
        },

        getScrollingDiv: function() {
            return this.scrollingDiv;
        },

        distributeArticles: function() {
            /* Columns first distribution. */
            var leftPos = 0;
            var topPos = 0;

            var article_counter = 1;
            var article_item = null;

            if (ASBasic.orientation.current === 'Horizontal') {
                for (i = 0; i < ASBasic.nColumns; i += 1) {  // Distributing rows.

                    topPos = 0;  // Because of new row, reset this to start value.

                    for (j = 0; j < ASBasic.nRows; j += 1) {  // Distributing columns.
                        //console.log("article_counter: "  + article_counter);
                        if (article_counter <= ASArticle.nArticles) {  // Don't draw the none existing article boxes.

                            article_item = ASArticle.createArticles();

                            this.scrollingDiv.appendChild(article_item);

                            article_item.innerHTML = article_counter;  // Put here the content of article stamp later.
                            article_counter += 1;

                            article_item.style.top = topPos + 'px';
                            article_item.style.left = leftPos + 'px';

                            topPos += ASArticle.height + ASBasic.gap;
                        }
                    }

                    leftPos += ASArticle.width + ASBasic.gap;
                }

            } else if (ASBasic.orientation.current === 'Vertical') {
                for (i = 0; i < ASBasic.nRows; i += 1) {  // Distributing columns.

                    leftPos = 0;  // Because of new row, reset this to start value.

                    for (j = 0; j < ASBasic.nColumns; j += 1) {  // Distributing rows.
                        //console.log("article_counter: "  + article_counter);
                        if (article_counter <= ASArticle.nArticles) {  // Don't draw the none existing article boxes.

                            article_item = ASArticle.createArticles();

                            this.scrollingDiv.appendChild(article_item);

                            article_item.innerHTML = article_counter;  // Put here the content of article stamp later.
                            article_counter += 1;

                            article_item.style.top = topPos + 'px';
                            article_item.style.left = leftPos + 'px';

                            leftPos += ASArticle.width + ASBasic.gap;
                        }
                    }

                    topPos += ASArticle.height + ASBasic.gap;
                }
            }
        }
    }


    var ASNavigatorButtons = {
        // Navigation buttons
        width: 0,
        height: 0,
        upLeft: null,
        downRight: null,

        setNavigation: function() {
            /* This should be put in condition for checking if navigations are needed at all. */
            //    if (ASMainContainer.width < (ASScrollingDiv.width + 2 * ASArticle.gap)) {}
            this.upLeft = document.getElementById('up_left_nav');
            this.downRight = document.getElementById('down_right_nav');

            if (ASBasic.orientation.current === 'Horizontal') {

                this.upLeft.className += ' navigation_horizontal';
                this.downRight.className += ' navigation_horizontal';

                this.height = ASMainContainer.height;
                //console.log("x--->: " + ASMainContainer.height);
                //console.log(this.height);
                this.width = 50 + 2;  // Set manualy.

                this.upLeft.style.width = this.width + 'px';
                this.upLeft.style.height = this.height + 'px';

                this.downRight.style.width = this.width + 'px';
                this.downRight.style.height = this.height + 'px';

                /* Positioning navigator buttons. */
                this.upLeft.style.left = 0 + 'px';
                this.downRight.style.left = ASMainContainer.width + this.width + 4 + 'px';

                this.upLeft.style.top = 0 + 'px';
                this.downRight.style.top = 0 + 'px';

            } else if (ASBasic.orientation.current === 'Vertical') {

                this.upLeft.className += ' navigation_vertical';
                this.downRight.className += ' navigation_vertical';

                this.width = ASMainContainer.width;
                //console.log("widht: " + this.width);
                this.height = 50 + 2;  // Manualy.
                //console.log("height: " + this.height);

                this.upLeft.style.width = this.width + 'px';
                this.upLeft.style.height = this.height + 'px';

                this.downRight.style.width = this.width + 'px';
                this.downRight.style.height = this.height + 'px';

                /* Repositioning the mainContainer. */
                var mc = ASMainContainer.getMainContainer();
                var mctop = mc.offsetTop;
                mc.style.top = this.height + 2 + 'px';

                this.upLeft.style.left = 0 + 'px';
                this.upLeft.style.top = 0 + 'px';

                this.downRight.style.left = 0 + 'px';
                this.downRight.style.top = ASMainContainer.height + ASNavigatorButtons.height + 2 + 'px';
            }

            return [this.upLeft, this.downRight];
        },

        getUpLeft: function() {
            return this.upLeft;
        },

        getDownRight: function() {
            return this.downRight;
        },
    }  // ASNavigatorButtons object.


    var ASSliderBar = {
        // Slider bar.
        sliderOn: true,
        slider: null,
        sliderWidth: 0,
        sliderHeight: 0,

        maxScrollingDivMovement: 0,
        moveLimit: 0,
        SAVED_MOVE_LIMIT: 0,
        stepDivisor: 0,

        scrollingReminder: 0,

        scrollDivCalculatedPosX: 0,  // var scroll_div_x_pos
        scrollDivCalculatedPosY: 0,

        scrollDivCurrentPosX: 0,  // var position
        scrollDivCurrentPosY: 0,

        // IMPORTANT!: The sum of the array numbers have to be 100!!! */
        tween: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        tweenFrameNumber: 0,
        inAnimation: false,
        timerID: 0,
        frames: [],

        scrolling: false,  // Is scrolling going on? Is yes disable clicking event.

        maxSliderMovementH: 0,
        scaleSliderMovementH: 0,
        scaleScrollDivMovementH: 0,

        maxSliderMovementV: 0,
        scaleSliderMovementV: 0,
        scaleScrollDivMovementV: 0,

        sliderPosX: 0,
        sliderPosY: 0,

        up: true,  // event: if mouse button is not pressed down.
        move: false,  // event: 

        readX: 0,   // event: cursor x position on the screen.
        lastX: 0,   // event: previously clicked x position.
        clickX: 0,  // event: x position where is clicked.
        diffX: 0,   // event: lasX - readX
        // Check if slider is moved manualy.
        // If true, have to recalculate dramaticaly moveLimit variable!
        slided: false,

        sliderWidth: 0,
        sliderHeight: 0,

        articleMultiplier: 2,

        i: 0,  // this is a simple object iterator.

        setSlider: function() {
            this.scrollDivCurrentPosX = ASScrollingDiv.scrollingDiv.offsetLeft;  // var position
            this.tweenFrameNumber = this.tween.length;

            if (ASBasic.orientation.current === 'Horizontal') {
                if (ASScrollingDiv.width > ASMainContainer.width) {
                    this.maxScrollingDivMovement = ASScrollingDiv.width - ASMainContainer.width;
                    //console.log("maxScrollingDivMovement: " + this.maxScrollingDivMovement);

                    /* Partitioning max movement of scrolling div per one click. */
                    this.moveLimit = this.articleMultiplier * ASArticle.width + this.articleMultiplier * ASBasic.gap;
                    //this.SAVED_MOVE_LIMIT = this.moveLimit;
                    //console.log("moveLimit: " + this.moveLimit);
                    //this.stepDivisor = parseInt(Math.floor(this.maxScrollingDivMovement / this.moveLimit));
                    this.stepDivisor = parseInt(Math.ceil(this.maxScrollingDivMovement / this.moveLimit));
                    //this.stepDivisor = this.maxScrollingDivMovement / this.moveLimit;
                    //console.log("stepDivisor: " + this.stepDivisor);

                    // Recalculated moveLimit for precission. !!! Very important !!!
                    this.moveLimit = this.maxScrollingDivMovement / this.stepDivisor;
                    console.log("moveLimit: " + this.moveLimit);
                    this.SAVED_MOVE_LIMIT = this.moveLimit;

                    if (this.sliderOn) {
                        // Creating a slider bar.
                        this.slider = document.getElementById('slider_div');

                        if (typeof this.slider !== null) {
                            this.slider.setAttribute('class', 'slider_div_horizontal');
                            this.slider.style.visibility = 'visible';
                            this.sliderWidth = (ASMainContainer.width / ASScrollingDiv.width) * ASMainContainer.width;
                            this.slider.style.width = this.sliderWidth + 'px';
                            this.sliderHeight = 7;
                            this.slider.style.height = this.sliderHeight + 'px';
                            this.slider.style.left = 0 + 'px';

                            this.maxSliderMovementH = ASMainContainer.width - this.sliderWidth;
                            this.scaleSliderMovementH = this.maxSliderMovementH / (ASScrollingDiv.width - ASMainContainer.width);
                            this.scaleScrollDivMovementH = (ASScrollingDiv.width - ASMainContainer.width) / this.maxSliderMovementH;

                        } else {
                            console.log("ERROR: no slider!");
                        }
                    }

                } else if (ASScrollingDiv.width <= ASMainContainer.width) {
                    // pass.
                }

            } else if (ASBasic.orientation.current === 'Vertical') {
                if (ASScrollingDiv.height > ASMainContainer.height) {
                    this.maxScrollingDivMovement = ASScrollingDiv.height - ASMainContainer.height;
                    this.moveLimit = this.articleMultiplier * ASArticle.height + this.articleMultiplier * ASBasic.gap;
                    this.stepDivisor = parseInt(Math.ceil(this.maxScrollingDivMovement / this.moveLimit));

                    // Recalculate moveLimit. !!! Very important !!!
                    this.moveLimit = this.maxScrollingDivMovement / this.stepDivisor;
                    console.log("moveLimit: " + this.moveLimit);
                    this.SAVED_MOVE_LIMIT = this.moveLimit;

                    if (this.sliderOn) {
                        this.slider = document.getElementById('slider_div');

                        if (typeof this.slider !== null) {
                            this.slider.setAttribute('class', 'slider_div_vertical');
                            this.slider.style.visibility = 'visible';
                            this.sliderHeight = (ASMainContainer.height / ASScrollingDiv.height) * ASMainContainer.height;
                            this.slider.style.height = this.sliderHeight + 'px';
                            this.sliderWidth = 7;
                            this.slider.style.width = this.sliderWidth + 'px';
                            this.slider.style.left = 0 + 'px';

                            this.maxSliderMovementV = ASMainContainer.height - this.sliderHeight;
                            this.scaleSliderMovementV = this.maxSliderMovementV / (ASScrollingDiv.height - ASMainContainer.height);
                            this.scaleScrollDivMovementV = (ASScrollingDiv.height - ASMainContainer.height) / this.maxSliderMovementV;

                        } else {
                            console.log("ERROR: no slider!");
                        }
                    }

                } else if (ASScrollingDiv.height <= ASMainContainer.height) {
                    // pass.
                }
            }
        },  // doASliding() function.


        /* Following functions can't use this keyword because they are attached to elements as event listeners.
         * Instead use function name as namespace.*/
        // Scrolling to the left function.
        scrollingLeft: function() {
            var funcCounter = 0;  // recursive function call counter!
            var stepCounter = 0;

            return function() {
                if (ASBasic.orientation.current === 'Horizontal') {
                    // Math.floor because dealing with negative numbers!
                    if (Math.floor(ASSliderBar.scrollDivCalculatedPosX) > -(ASSliderBar.maxScrollingDivMovement) &&
                        funcCounter < ASSliderBar.tweenFrameNumber) {

                        if (ASSliderBar.slided) {
                            //ASSliderBar.scrollingReminder = ASSliderBar.maxScrollingDivMovement - Math.abs(ASSliderBar.scrollDivCalculatedPosX);
                            ASSliderBar.scrollingReminder = ASSliderBar.maxScrollingDivMovement - ASSliderBar.scrollDivCalculatedPosX;
                            //ASSliderBar.stepDivisor = parseInt(Math.ceil(ASSliderBar.scrollingReminder / ASSliderBar.moveLimit));
                            ASSliderBar.stepDivisor = ASSliderBar.scrollingReminder / ASSliderBar.moveLimit;

                            if (ASSliderBar.stepDivisor > 1) {
                                ASSliderBar.moveLimit = ASSliderBar.scrollingReminder / this.stepDivisor;
                            } else if (ASSliderBar.stepDivisor === 1) {
                                ASSliderBar.moveLimit = ASSliderBar.scrollingReminder;
                            }

                            ASSliderBar.slided = false;
                        }

                        // If not in animation initialize frames.
                        if (!ASSliderBar.inAnimation) {
                            ASSliderBar.scrollDivCurrentPosX = ASScrollingDiv.scrollingDiv.offsetLeft * -1;

                            for (ASSliderBar.i = 0; ASSliderBar.i < ASSliderBar.tweenFrameNumber; ASSliderBar.i += 1) {
                                ASSliderBar.scrollDivCurrentPosX += (ASSliderBar.moveLimit * ASSliderBar.tween[ASSliderBar.i] * 0.01);
                                ASSliderBar.frames[ASSliderBar.i] = ASSliderBar.scrollDivCurrentPosX;
                            }

                            ASSliderBar.i = 0;
                            ASSliderBar.inAnimation = true;
                            stepCounter += 1;
                        }

                        ASSliderBar.scrollDivCalculatedPosX = -ASSliderBar.frames[funcCounter];
                        // Math.abs - because slider bar never goes on negative side.
                        // Is's minimal position is 0, max is maxSliderMovementH.
                        ASSliderBar.sliderPosX = Math.abs(ASSliderBar.scrollDivCalculatedPosX * ASSliderBar.scaleSliderMovementH);

                        ASScrollingDiv.scrollingDiv.style.left = ASSliderBar.scrollDivCalculatedPosX + 'px';

                        ASSliderBar.slider.style.left = ASSliderBar.sliderPosX + 'px';

                        funcCounter += 1;

                        ASSliderBar.timerID = setTimeout(ASSliderBar.scrollingLeft, 50);

                    } else {
                        funcCounter = 0;
                        ASSliderBar.inAnimation = false;
                        clearTimeout(ASSliderBar.timerID);  // Not necessary.
                    }

                } else if (ASBasic.orientation.current === 'Vertical') {
                    // Math.floor because dealing with negative numbers!
                    if (Math.floor(ASSliderBar.scrollDivCalculatedPosY) > -(ASSliderBar.maxScrollingDivMovement) &&
                        funcCounter < ASSliderBar.tweenFrameNumber) {

                        //if (ASSliderBar.slided) {
                        //    ASSliderBar.scrollingReminder = ASSliderBar.maxScrollingDivMovement - Math.abs(ASSliderBar.scrollDivCalculatedPosX);
                        //    //ASSliderBar.stepDivisor = parseInt(Math.ceil(ASSliderBar.scrollingReminder / ASSliderBar.moveLimit));
                        //    ASSliderBar.stepDivisor = ASSliderBar.scrollingReminder / ASSliderBar.moveLimit;

                        //    if (ASSliderBar.stepDivisor > 1) {
                        //        ASSliderBar.moveLimit = ASSliderBar.scrollingReminder / this.stepDivisor;
                        /*    } else if (ASSliderBar.stepDivisor === 1) { */
                        //        ASSliderBar.moveLimit = ASSliderBar.scrollingReminder;
                        //    }

                        //    ASSliderBar.slided = false;
                        //}

                        // If not in animation initialize frames.
                        if (!ASSliderBar.inAnimation) {
                            ASSliderBar.scrollDivCurrentPosY = ASScrollingDiv.scrollingDiv.offsetTop * -1;
                            console.log("scrollingdiv postition top: " + ASSliderBar.scrollDivCurrentPosY);

                            for (ASSliderBar.i = 0; ASSliderBar.i < ASSliderBar.tweenFrameNumber; ASSliderBar.i += 1) {
                                ASSliderBar.scrollDivCurrentPosY += (ASSliderBar.moveLimit * ASSliderBar.tween[ASSliderBar.i] * 0.01);
                                ASSliderBar.frames[ASSliderBar.i] = ASSliderBar.scrollDivCurrentPosY;
                            }

                            ASSliderBar.i = 0;
                            ASSliderBar.inAnimation = true;
                            stepCounter += 1;
                        }

                        ASSliderBar.scrollDivCalculatedPosY = -ASSliderBar.frames[funcCounter];
                        // Math.abs - because slider bar never goes on negative side.
                        // Is's minimal position is 0, max is maxScrollingDivMovement.
                        ASSliderBar.sliderPosY = Math.abs(ASSliderBar.scrollDivCalculatedPosY * ASSliderBar.scaleSliderMovementV);

                        ASScrollingDiv.scrollingDiv.style.top = ASSliderBar.scrollDivCalculatedPosY + 'px';

                        ASSliderBar.slider.style.top = ASSliderBar.sliderPosY + 'px';

                        funcCounter += 1;

                        ASSliderBar.timerID = setTimeout(ASSliderBar.scrollingLeft, 50);

                    } else {
                        funcCounter = 0;
                        ASSliderBar.inAnimation = false;
                        clearTimeout(ASSliderBar.timerID);  // Not necessary.
                    }
                }
            }
        }(),  // END of scrollingLeft function

        scrollingRight: function() {
            var funcCounter = 0;

            return function() {
                //console.log("Pressed to the RIGHT");
                if (ASBasic.orientation.current === 'Horizontal') {
                    if (Math.ceil(ASSliderBar.scrollDivCalculatedPosX) < 0 && funcCounter < ASSliderBar.tweenFrameNumber) {

                        if (ASSliderBar.slided) {
                            ASSliderBar.scrollingReminder = Math.abs(ASSliderBar.scrollDivCalculatedPosX);
                            ASSliderBar.stepDivisor = parseInt(Math.ceil(ASSliderBar.scrollingReminder / ASSliderBar.moveLimit));

                            if (ASSliderBar.stepDivisor > 1) {
                                ASSliderBar.moveLimit = ASSliderBar.scrollingReminder / ASSliderBar.stepDivisor;
                            } else if (ASSliderBar.stepDivisor === 1) {
                                ASSliderBar.moveLimit = ASSliderBar.scrollingReminder;
                            }

                            ASSliderBar.slided = false;
                        }

                        if (!ASSliderBar.inAnimation) {
                            ASSliderBar.scrollDivCurrentPosX = ASScrollingDiv.scrollingDiv.offsetLeft * -1;

                            for (i = 0; i < ASSliderBar.tweenFrameNumber; i += 1) {
                                ASSliderBar.scrollDivCurrentPosX -= (ASSliderBar.moveLimit * ASSliderBar.tween[i] * 0.01);
                                ASSliderBar.frames[i] = ASSliderBar.scrollDivCurrentPosX;
                            }

                            ASSliderBar.inAnimation = true;
                        }

                        ASSliderBar.scrollDivCalculatedPosX = -ASSliderBar.frames[funcCounter];
                        ASSliderBar.sliderPosX = -(ASSliderBar.scrollDivCalculatedPosX * ASSliderBar.scaleSliderMovementH);
                        ASScrollingDiv.scrollingDiv.style.left = ASSliderBar.scrollDivCalculatedPosX + 'px';
                        ASSliderBar.slider.style.left = ASSliderBar.sliderPosX + 'px';
                        funcCounter += 1;
                        ASSliderBar.timerID = setTimeout(ASSliderBar.scrollingRight, 50);

                        //if ((ASSliderBar.scrollDivCalculatedPosX < 0.0 && ASSliderBar.scrollDivCalculatedPosX > -1.0) ||
                        //    (ASSliderBar.scrollDivCalculatedPosX > 0.0 && ASSliderBar.scrollDivCalculatedPosX < 1.0)) {
                        //    ASSliderBar.moveLimit = ASSliderBar.SAVED_MOVE_LIMIT;
                        //}

                    } else {
                        funcCounter = 0;
                        ASSliderBar.inAnimation = false;
                        clearTimeout(ASSliderBar.timerID);  // Not necessery.
                    }
                } else if (ASBasic.orientation.current === 'Vertical') {
                    if (Math.ceil(ASSliderBar.scrollDivCalculatedPosY) < 0 && funcCounter < ASSliderBar.tweenFrameNumber) {

                        //if (ASSliderBar.slided) {
                        //    ASSliderBar.scrollingReminder = Math.abs(ASSliderBar.scrollDivCalculatedPosX);
                        //    ASSliderBar.stepDivisor = parseInt(Math.ceil(ASSliderBar.scrollingReminder / ASSliderBar.moveLimit));

                        //    if (ASSliderBar.stepDivisor > 1) {
                        //        ASSliderBar.moveLimit = ASSliderBar.scrollingReminder / ASSliderBar.stepDivisor;
                        //    } else if (stepDivisor === 1) {
                        //        ASSliderBar.moveLimit = ASSliderBar.scrollingReminder;
                        //    }

                        //    ASSliderBar.slided = false;
                        //}

                        if (!ASSliderBar.inAnimation) {
                            ASSliderBar.scrollDivCurrentPosY = ASScrollingDiv.scrollingDiv.offsetTop * -1;

                            for (i = 0; i < ASSliderBar.tweenFrameNumber; i += 1) {
                                ASSliderBar.scrollDivCurrentPosY -= (ASSliderBar.moveLimit * ASSliderBar.tween[i] * 0.01);
                                ASSliderBar.frames[i] = ASSliderBar.scrollDivCurrentPosY;
                            }

                            ASSliderBar.inAnimation = true;
                        }

                        ASSliderBar.scrollDivCalculatedPosY = -ASSliderBar.frames[funcCounter];
                        ASSliderBar.sliderPosY = -(ASSliderBar.scrollDivCalculatedPosY * ASSliderBar.scaleSliderMovementV);
                        ASScrollingDiv.scrollingDiv.style.top = ASSliderBar.scrollDivCalculatedPosY + 'px';
                        ASSliderBar.slider.style.top = ASSliderBar.sliderPosY + 'px';
                        funcCounter += 1;
                        ASSliderBar.timerID = setTimeout(ASSliderBar.scrollingRight, 50);

                        //if ((ASSliderBar.scrollDivCalculatedPosX < 0.0 && ASSliderBar.scrollDivCalculatedPosX > -1.0) ||
                        //    (ASSliderBar.scrollDivCalculatedPosX > 0.0 && ASSliderBar.scrollDivCalculatedPosX < 1.0)) {
                        //    ASSliderBar.moveLimit = ASSliderBar.SAVED_MOVE_LIMIT;
                        //}

                    } else {
                        funcCounter = 0;
                        ASSliderBar.inAnimation = false;
                        clearTimeout(ASSliderBar.timerID);  // Not necessery.
                    }
                }
            }
        }(),

        sliderMousedown: function(e) {
            /* This function saves the clicked postion of mouse's 'click' event and sets this.up to false. */
            if (!e) {
                var e = window.event;
            }
            console.log("MouseDown Event");

            ASSliderBar.slider.style.background = '#800000';

            if (e.pageX) {  // Chrome, Opera
                //console.log('chrome/opera');
                //console.log('mousedown');
                //console.log("bla bal " + this.up);
                ASSliderBar.up = false;
                //console.log("up: ", up);
                ASSliderBar.clickX = e.pageX;  // Initializes the first click position.
                ASSliderBar.lastX = ASSliderBar.clickX;  // Momorize this position for the future calculations.
                //console.log('click_x :' + click_x);

            } else if (e.clientX) {  // Firefox!
                //console.log('firefox');
                ASSliderBar.clickX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                ASSliderBar.lastX = ASSliderBar.clickX;
            }
        },

        sliderMousemove: function(e) {
            /* This function works only if there was mousedown event on the slider_div element.
             * It is attached to the document element. */
            //console.log("up: " + this.up);
            if (!ASSliderBar.up) {  // If holding down the button on slider bar.
                if (!e) {
                    var e = window.event;
                }

                console.log("MouseMove Event");
                ASSliderBar.slided = true;
                //console.log(ASSliderBar.slider);

                // Calculating the slider_div position and moving it also.
                if (e.pageX) {
                    //console.log("I'm here!");
                    //console.log("readX: " + this.readX);
                    ASSliderBar.readX = e.pageX;
                } else if (e.clientX) {
                    ASSliderBar.readX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                }
                //console.log('read_x :' + this.readX);

                // Moving slider bar to the RIGHT.
                if ((ASSliderBar.readX > ASSliderBar.lastX) &&
                    ASSliderBar.sliderPosX <= ASSliderBar.maxSliderMovementH &&
                    ASSliderBar.scrollDivCalculatedPosX > -(ASSliderBar.maxScrollingDivMovement)) {

                    ASSliderBar.diffX = (ASSliderBar.readX - ASSliderBar.lastX);  // Difference between current postion and last
                    //console.log('diff_x: ' + this.diffX);

                    if ((ASSliderBar.sliderPosX + ASSliderBar.diffX) <= ASSliderBar.maxSliderMovementH) {
                        ASSliderBar.sliderPosX += ASSliderBar.diffX;
                        ASSliderBar.scrollDivCalculatedPosX = -(ASSliderBar.sliderPosX * ASSliderBar.scaleScrollDivMovementH);

                    } else if ((ASSliderBar.sliderPosX + ASSliderBar.diffX) > ASSliderBar.maxSliderMovementH) {
                        ASSliderBar.sliderPosX = ASSliderBar.maxSliderMovementH;
                        ASSliderBar.scrollDivCalculatedPosX = -(ASSliderBar.maxScrollingDivMovement);
                    }
                    //console.log('moving right: slider_x_pos: ' + this.sliderPosX);
                    ASSliderBar.slider.style.left = ASSliderBar.sliderPosX + "px";
                    ASScrollingDiv.scrollingDiv.style.left = ASSliderBar.scrollDivCalculatedPosX + "px";
                    ASSliderBar.lastX = ASSliderBar.readX;
                    //console.log("pos slider " + ASSliderBar.sliderPosX);

                // Moving slider bar to the LEFT.
                } else if ((ASSliderBar.readX < ASSliderBar.lastX) &&
                            ASSliderBar.sliderPosX >= 0 &&
                            ASSliderBar.scrollDivCalculatedPosX < 0) {

                    ASSliderBar.diffX = (ASSliderBar.lastX - ASSliderBar.readX);

                    if ((ASSliderBar.sliderPosX - ASSliderBar.diffX) >= 0) {
                        ASSliderBar.sliderPosX -= ASSliderBar.diffX;
                        ASSliderBar.scrollDivCalculatedPosX = -(ASSliderBar.sliderPosX * ASSliderBar.scaleScrollDivMovementH);
                    } else if ((ASSliderBar.sliderPosX - ASSliderBar.diffX) < 0) {
                        //console.log('left zerozero!');
                        //console.log("haho");
                        ASSliderBar.sliderPosX = 0;
                        ASSliderBar.scrollDivCurrentPosX = 0;
                    }
                    //console.log('moving left: slider_x_pos: ' + this.sliderPosX);
                    //console.log("pos slider " + ASSliderBar.sliderPosX);
                    ASSliderBar.slider.style.left = ASSliderBar.sliderPosX + "px";
                    ASScrollingDiv.scrollingDiv.style.left = ASSliderBar.scrollDivCalculatedPosX + "px";
                    ASSliderBar.lastX = ASSliderBar.readX;
                }
            }
        },

        sliderMouseup: function(e) {
            /*
             * This function is only executed if there was a mousedown event on
             * slider_div element and it turned off the this.up to false.
             * It is attached to the document element.
             * */
            if (!e) {
                var e = window.event;
            }

            if (!ASSliderBar.up) {
                ASSliderBar.up = true;
                ASSliderBar.clickX = 0;
                ASSliderBar.lastX = 0;
                ASSliderBar.diffX = 0;
                console.log('MouseUp Event');
                ASSliderBar.slider.style.background = '#4c0000';
            }
        },

        /* Selecting element are not possible on this page.
         * This is attached to the document.body element. */
        preventSelecting: function(e) {
            if (!ASSliderBar.up) {
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
        }
    }  // END Slider object.


    var ASWrapper = {
        width: 0,
        height: 0,

        wrapper: null,

        setWrapper: function() {
            this.wrapper = document.getElementById('wrapper');

            if (typeof this.wrapper !== null) {
                if (ASBasic.orientation.current === 'Horizontal') {
                    this.width = ASMainContainer.width + (2 * ASNavigatorButtons.width) + 4;
                    this.height = ASMainContainer.height;

                } else if (ASBasic.orientation.current === 'Vertical') {
                    this.width = ASMainContainer.width;
                    this.height = ASMainContainer.height + (2 * ASNavigatorButtons.height) + 2;
                }

                this.wrapper.style.width = this.width + 2 + 'px';
                this.wrapper.style.height = this.height + 2 + 'px';
                this.wrapper.style.top = 0 + 'px';  /* This should be set in css file. */
                this.wrapper.style.left = 0 + 'px'; /* This should be set in css file. */

            } else {
                conosle.log("ERROR: wrapper object not found in html file.");
            }

        }
    }

    /* *********************************** *
     * The actual construction of slider.  *
     * *********************************** */

    ASBasic.orientation.setOrientation(0);
    console.log("Orientation: " + ASBasic.orientation.current);

    ASMainContainer.setMainContainer();
    var navButtons = ASNavigatorButtons.setNavigation();
    ASMainContainer.setArticleSlider();
    ASWrapper.setWrapper();
    ASSliderBar.setSlider();

    // Adding event listeners to buttons.
    navButtons[0].addEventListener('click', ASSliderBar.scrollingLeft, false);
    navButtons[1].addEventListener('click', ASSliderBar.scrollingRight, false);

    // Adding event listeners to slider bar.
    ASSliderBar.slider.addEventListener('mousedown', ASSliderBar.sliderMousedown, false);
    document.addEventListener('mouseup', ASSliderBar.sliderMouseup, false);
    document.addEventListener('mousemove', ASSliderBar.sliderMousemove, false);
    document.addEventListener('selectstart', ASSliderBar.preventSelecting, false);

    //    // Decoration of slider_bar: coloring...
    ASSliderBar.slider.addEventListener('mouseover', function() {
        ASSliderBar.slider.style.background = '#800000';
    }, false);

    ASSliderBar.slider.addEventListener('mouseout', function() {
       // if (this.up) {
            ASSliderBar.slider.style.background = '#4c0000';
       // }
    }, false);
})(window);

    //    throw {
    //        name: "Error: Wrong orientation settings!",
    //        message: "Can't have horizontal and vertical setting the same value!"
    //    }
    //    console.log("Error: Wrong orientation settings!");

    //    var scroll_div_max_movement = scroll_div_width - container_width;
    //    console.log("scroll_div_max_movement: " + scroll_div_max_movement);

    //    // Partitioning scroll_div_max_movement in to equal parts, according to max one step movement.
    //    // max one step movement is currently (2xNUMBER_OF_COLUMNS) + (2xGAP).
    //    var move_limit = 2 * article_item_width + 2 * GAP; // 170px
    //    var equal_divisor = parseInt(Math.floor(scroll_div_max_movement / move_limit));
    //    console.log("equal divisor: " + equal_divisor);
    //    console.log("move limit: " + move_limit);
    //    console.log("equal divisor: " + equal_divisor);
    //    move_limit = scroll_div_max_movement / equal_divisor;
    //    console.log("<recalculated> move limit: " + move_limit);

    //    var SAVED_MOVE_LIMIT = move_limit;
    //    var scroll_reminder = 0;

    //    container.style.overflowX = 'hidden';
    //    scroll_div_width = (NUMBER_OF_COLUMNS * article_item_width) + ((NUMBER_OF_COLUMNS + 1) * GAP);
    //    scroll_div_height = (NUMBER_OF_ROWS * article_item_height) + ((NUMBER_OF_ROWS + 1) * GAP);
    //    scroll_div.style.width = scroll_div_width + 'px';
    //    scroll_div.style.height = scroll_div_height + 'px';
    //    console.log("scroll_div_width: " + scroll_div_width);
    //    var scroll_div_max_movement = scroll_div_width - container_width;
    //    console.log("scroll_div_max_movement: " + scroll_div_max_movement);

    //    // Partitioning scroll_div_max_movement in to equal parts, according to max one step movement.
    //    // max one step movement is currently (2xNUMBER_OF_COLUMNS) + (2xGAP).
    //    var move_limit = 2 * article_item_width + 2 * GAP; // 170px
    //    var equal_divisor = parseInt(Math.floor(scroll_div_max_movement / move_limit));
    //    console.log("equal divisor: " + equal_divisor);
    //    console.log("move limit: " + move_limit);
    //    console.log("equal divisor: " + equal_divisor);
    //    move_limit = scroll_div_max_movement / equal_divisor;
    //    console.log("<recalculated> move limit: " + move_limit);

    //    var SAVED_MOVE_LIMIT = move_limit;
    //    var scroll_reminder = 0;

    //    container.style.overflowX = 'hidden';


    /* *********************************************
        *  If we have more then 18 articles available.
        *  Then grab the navigations.
        * *********************************************/
    //if (scroll_div.children.length > 18) {
    //    left_nav = document.getElementById('left_nav');
    //    right_nav = document.getElementById('right_nav');
    //    slider_bar = document.getElementById('slider_div');
    //    left_nav.style.height = container_height + "px";
    //    right_nav.style.height = container_height + "px";

    //    // Creating slider_bar.
    //    console.log(container_width);
    //    var slider_bar_width = ((container_width / scroll_div_width) * container_width);
    //    slider_bar.style.width = slider_bar_width + "px";
    //    slider_bar.style.visibility = "visible";

    //    var scroll_div_x_pos = 0;
    //    var position = scroll_div.offsetLeft;  // Get the value of the left property!
    //    console.log('position: ' + position);

    //    /* IMPORTANT!: The sum of the array numbers have to be 100!!! */
    //    var tween = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    //    var frames_number = tween.length;
    //    var timer_id;
    //    var in_animation = false;
    //    var frames = [];

    //    /* **************************************
    //     *  Definitions of navigation functions.
    //     * **************************************/
    //    var up = true,
    //        move = false;
    //    var max_slider_movement = container_width - slider_bar_width;
    //    console.log("slider_width " + slider_bar_width);
    //    console.log("max_slider_movement " + max_slider_movement);
    //    var scale_slider_movement = max_slider_movement / (scroll_div_width - container_width);
    //    var scale_scroll_div_movement = (scroll_div_width - container_width) / max_slider_movement;
    //    var slider_x_pos = 0;
    //    var read_x = 0;
    //    var click_x = 0;
    //    var diff_x = 0;
    //    var last_x = 0;

    //    var slided = false;  // Check if slider is moved. If true have to recalculate move_limit varible!

    //    var scroll_left = (function() {
    //        var funcCounter = 0;

    //        return function() {
    //            if (scroll_div_x_pos > -(scroll_div_max_movement) &&
    //                funcCounter < tween.length) {

    //                if (slided) {
    //                    /* Recalculate move_limit. */
    //                    scroll_reminder = scroll_div_max_movement - Math.abs(scroll_div_x_pos);
    //                    console.log("scroll_reminder: " + scroll_reminder);
    //                    equal_divisor = parseInt(Math.ceil(scroll_reminder / move_limit));
    //                    console.log("equal_divisor: " + equal_divisor);
    //                    if (equal_divisor > 1) {
    //                        //equal_divisor = parseInt(Math.ceil(equal_divisor));
    //                        move_limit = scroll_reminder / equal_divisor;
    //                        console.log("move_limit: " + move_limit);
    //                    } else if (equal_divisor === 1) {
    //                        move_limit = scroll_reminder;
    //                        console.log("move_limit: " + move_limit);
    //                    }
    //                    slided = false;
    //                }

    //                if (!in_animation) {  // Then calculate new positions.
    //                    position = scroll_div.offsetLeft * -1;
    //                    console.log('scroll_div.offsetLeft: ', scroll_div.offsetLeft);
    //                    for (i = 0; i < frames_number; i += 1) {
    //                        position += (move_limit * tween[i] * 0.01);
    //                        frames[i] = position;
    //                    }
    //                    i = 0;
    //                    in_animation = true;
    //                }

    //                scroll_div_x_pos = -frames[funcCounter];
    //                slider_x_pos = Math.abs(scroll_div_x_pos * scale_slider_movement);
    //                console.log("scroll_div_x_pos: " + scroll_div_x_pos);
    //                scroll_div.style.left = scroll_div_x_pos + "px";
    //                slider_bar.style.left = slider_x_pos + "px";
    //                funcCounter += 1;
    //                // Recursion.
    //                timer_id = setTimeout(scroll_left, 50);

    //                if (scroll_div_x_pos <= -(scroll_div_max_movement)) {
    //                    move_limit = SAVED_MOVE_LIMIT;
    //                }

    //            } else {
    //                funcCounter = 0;
    //                in_animation = false;
    //                clearTimeout(timer_id);  // Not necessary.
    //            }
    //        }
    //    })();

    //    var scroll_right = (function() {
    //        var funcCounter = 0;

    //        return function() {
    //            if (scroll_div_x_pos < 0 && funcCounter < tween.length) {

    //                if (slided) {
    //                    /* Recalculate move_limit. */
    //                    scroll_reminder = Math.abs(scroll_div_x_pos);
    //                    equal_divisor = parseInt(Math.ceil(scroll_reminder / move_limit));
    //                    if (equal_divisor > 1) {
    //                        //equal_divisor = parseInt(Math.ceil(equal_divisor));
    //                        move_limit = scroll_reminder / equal_divisor;
    //                    } else if (equal_divisor === 1) {
    //                        move_limit = scroll_reminder;
    //                    }
    //                    slided = false;
    //                }

    //                if (!in_animation) {  // Then calculate new positions.
    //                    position = scroll_div.offsetLeft * -1;
    //                    for (i = 0; i < frames_number; i += 1) {
    //                        position -= (move_limit * tween[i] * 0.01);
    //                        frames[i] = position;
    //                    }
    //                    in_animation = true;
    //                }

    //                scroll_div_x_pos = -frames[funcCounter];
    //                slider_x_pos = -(scroll_div_x_pos * scale_slider_movement);
    //                scroll_div.style.left = scroll_div_x_pos + "px";
    //                slider_bar.style.left = slider_x_pos + "px";
    //                funcCounter += 1;
    //                // Recursion.
    //                timer_id = setTimeout(scroll_right, 50);

    //                if ((scroll_div_x_pos < 0.0 && scroll_div_x_pos > -1.0) ||
    //                        (scroll_div_x_pos > 0.0 && scroll_div_x_pos < 1.0)) {
    //                    move_limit = SAVED_MOVE_LIMIT;
    //                    console.log("saved movelimit!");
    //                    console.log("move_limit: " + move_limit);
    //                }

    //            } else {
    //                console.log("Hey, conditions don't match.");
    //                funcCounter = 0;
    //                in_animation = false;
    //                clearTimeout(timer_id);
    //            }
    //        }
    //    })();






    //    /* This browser approach I found on:
    //     * http://www.quirksmode.org/js/events_properties.html */
    //    var slider_mousedown = function(e) {
    //        /* Function for setup the sliding possibilities.
    //         * It is attached to the slider_div element. */
    //        if (!e) {
    //            var e = window.event;
    //        }
    //        slider_div.style.background = '#800000';

    //        if (e.pageX) {  // Chrome, Opera
    //            console.log('chrome/opera');
    //            console.log('mousedown');
    //            up = false;
    //            //console.log("up: ", up);
    //            click_x = e.pageX;
    //            last_x = click_x;
    //            console.log('click_x :' + click_x);
    //        } else if (e.clientX) {  // Firefox!
    //            console.log('firefox');
    //            click_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    //            last_x = click_x;
    //        }
    //    };

    //    var slider_mousemove = function(e) {
    //        /* This function works only if there was mousedown event on the slider_div element.
    //         * It is attached to the document element. */
    //        if (!up) {
    //            if (!e) {
    //                var e = window.event;
    //            }

    //            slided = true;

    //            // Calculating the slider position and moving it also.
    //            // Moving slider to the RIGHT.
    //            if (e.pageX) {
    //                read_x = e.pageX;
    //            } else if (e.clientX) {
    //                read_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    //            }
    //            console.log('read_x :' + read_x);

    //            if ((read_x > last_x) &&
    //                slider_x_pos <= max_slider_movement &&
    //                scroll_div_x_pos > -(scroll_div_max_movement)) {

    //                diff_x = (read_x - last_x);
    //                console.log('diff_x: ' + diff_x);
    //                if ((slider_x_pos + diff_x) <= max_slider_movement) {
    //                    slider_x_pos += diff_x;
    //                    scroll_div_x_pos = -(slider_x_pos * scale_scroll_div_movement);
    //                } else if ((slider_x_pos + diff_x) > max_slider_movement) {
    //                    slider_x_pos = max_slider_movement;
    //                    scroll_div_x_pos = -(scroll_div_max_movement);
    //                }
    //                console.log('moving right: slider_x_pos: ' + slider_x_pos);
    //                slider_div.style.left = slider_x_pos + "px";
    //                scroll_div.style.left = scroll_div_x_pos + "px";
    //                last_x = read_x;

    //            // Moving slider to the LEFT.
    //            } else if ((read_x < last_x) &&
    //                        slider_x_pos >= 0 &&
    //                        scroll_div_x_pos < 0) {

    //                diff_x = (last_x - read_x);
    //                console.log('diff_x: ' + diff_x);
    //                if ((slider_x_pos - diff_x) >= 0) {
    //                    slider_x_pos -= diff_x;
    //                    scroll_div_x_pos = -(slider_x_pos * scale_scroll_div_movement);
    //                } else if ((slider_x_pos - diff_x) < 0) {
    //                    console.log('left zerozero!');
    //                    slider_x_pos = 0;
    //                    scroll_div_x_pos = 0;
    //                }
    //                console.log('moving left: slider_x_pos: ' + slider_x_pos);
    //                slider_div.style.left = slider_x_pos + "px";
    //                scroll_div.style.left = scroll_div_x_pos + "px";
    //                last_x = read_x;
    //            }
    //        }
    //    };

    //    var slider_mouseup = function(e) {
    //        /*
    //         * This function is only executed if there was a mousedown event on
    //         * slider_div element and it turned off the: up = false.
    //         * It is attached to the document element.
    //         * */
    //        if (!e) {
    //            var e = window.event;
    //        }

    //        if (!up) {
    //            up = true;
    //            click_x = 0;
    //            last_x = 0;
    //            diff_x = 0;
    //            console.log('mouseup');
    //            slider_div.style.background = '#4c0000';
    //        }
    //    }

    //    /* Selecting element are not possible on this page.
    //     * This is attached to the document.body element. */
    //    var preventSelecting = function(e) {
    //        if (!up) {
    //            if (!e) {
    //                var e = window.event;
    //            }
    //            // This part is for canceling selection.
    //            if ('cancelable' in e) {  // Firefox allways gives true.
    //                if (e.cancelable) {
    //                    e.preventDefault();
    //                }
    //            } else {
    //                e.returnValue = false;  // Firefox doesn't support this.
    //            }
    //        }
    //    };

    //    // Add event listeners to left and right navigatinos.
    //    left_nav.addEventListener('click', scroll_left, false);
    //    right_nav.addEventListener('click', scroll_right, false);

    //    // Slider stuff.
    //    slider_bar.addEventListener('mousedown', slider_mousedown, false);
    //    document.addEventListener('mouseup', slider_mouseup, false);
    //    document.addEventListener('mousemove', slider_mousemove, false);
    //    document.body.addEventListener('selectstart', preventSelecting, false);

    //    // Decoration of slider_bar: coloring...
    //    slider_bar.addEventListener('mouseover', function() {
    //        slider_bar.style.background = '#800000';
    //    });
    //    slider_bar.addEventListener('mouseout', function() {
    //        if (up) {
    //            slider_bar.style.background = '#4c0000';
    //        }
    //    });
    //}

//})(window);

// vim: set tw=120:
