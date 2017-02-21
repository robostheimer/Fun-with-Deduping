//Used to see how long it takes the script to evaluate
let startTime;
let endTime;
let executionTime;
let removeDups;
// uses createData function to create an array of
// 1,000,000 emails addresses
const emails = createData(['rob', 'elvis', 'suzie', 'james', 'nate', 'heather', 'linda', 'jim', 'syd', 'taylor', 'peter', 'andrew', 'ada', 'reed'], 100000, '@gmail.com');

//logging the email addresses since painting it to the DOM would require a ton of memory
console.log(`Check this out, it's 100K email addresses`, emails);

startTime = new Date();
removeDups = removeDuplicates(emails);
endTime = new Date();
executionTime = endTime.getMilliseconds() - startTime.getMilliseconds();

// Creates DOM for DeDuped Lists unordered list
createAndAppendDOM({
  htmlData: removeDups,
  attrs: { class: 'email' },
  tag: 'li',
  id: 'emails'
});

/** Unit Testing **/
//Testing hasDuplicates Flag with generic/hardcoded array
assert(hasDuplicates([2, 4, 5, 2]), 'Test to check that hasDuplicates flag works: this array has duplicates', 'Test that hasDuplicates flag works: this array does not have duplicates', 'hasDuplicates([2, 4, 5, 2])')
//Tesing that removeDups is actually a deduped array of emails
assert(!hasDuplicates(removeDups),  'Test for removeDuplicates function: there are no duplicates in this array', 'Test for removeDuplicates function: there are duplicates in this array', '!hasDuplicates(removeDups)');

//Testing execution time of the removeDuplicates function
assert(executionTime < 1000, `Amount of time it takes removeDuplicates Test to execute: Function took ${executionTime}ms to execute. Nice!`, 'Amount of time it takes removeDuplicates Test to execute: removeDuplicates Function took ${executionTime}ms to execute.  Better luck next time.', 'executionTime < 1000');

//Testing ordering of Deduped function using generic arrays
assert(isInOriginalOrderAfterDedupe([1,2,3,3,2], [1,2,3]), 'Test of the isInOriginalOrderAfterDedupe function: Generic/hardcoded arrays are in original order', 'Test of the isInOriginalOrderAfterDedupe function: Generic/hardcoded arrays are not in original order', 'isInOriginalOrderAfterDedupe([1,2,3,3,2], [1,2,3])')

//Testing that items in removeDups array are in the same order as the original emails array
assert(isInOriginalOrderAfterDedupe(emails, removeDups), 'All emails are in the same order as the original array', 'Note all emails are in the same order as the original array', 'isInOriginalOrderAfterDedupe(emails, removeDups)');

/** Functions **/

/**
  sets up a assert function used for unit testing
  appends the pass/fail div to the html document

  side-effect: adds <li> to document

  params: testOutcome {Boolean}
  params: testDescription {String}
  params: 'errorMsg' {String} *optional
*/
function assert(testOutcome, testDescription, errorMsg, assertion) {
  const msg = testOutcome ? testDescription:errorMsg || '';

  createAndAppendDOM({
    htmlData: [msg],
    attrs: { class: testOutcome ? 'pass':'fail' , id: assertion },
    tag:'button',
    id: 'test'
  });

  createAndAppendDOM({
    htmlData: [`Assertion Tested: ${assertion}`],
    tag:'p',
    id: assertion
  });

  createAndAppendDOM({
    htmlData: ['View Assertion'],
    tag:'div',
    id: assertion
  });

  let id = document.getElementById(assertion);
  id.addEventListener('click', function(e) {
    if(e.currentTarget.getElementsByTagName('p')[0].style.display === 'block') {
      e.currentTarget.getElementsByTagName('p')[0].style.display ='none';
      e.currentTarget.getElementsByTagName('div')[0].innerHTML = "View Assertion"
    } else {
      e.currentTarget.getElementsByTagName('p')[0].style.display ='block';
      e.currentTarget.getElementsByTagName('div')[0].style.display = "block"
      e.currentTarget.getElementsByTagName('div')[0].innerHTML = "Hide Assertion"
    }

  })
}

/**
  filters based on the first instance of an item in the
  arr (i.e. indexOf the arr) if the second instance of
  an item comes up the index will not equal the first
  indexOf that item and thus will not pass the filter test

  returns {Array}

  params: arr {Array}
*/
function removeDuplicates(arr) {
  let deDuped = arr.filter(function(item, index) {
    return arr.indexOf(item) === index;
  })

  // option 2 would use a forEach to loop through
  // the originial array and push into a container
  // array by checking if an item in the original array
  // does not exist in the container array.
  // about 10ms slower than the filter method above
  /*let deDuped = [];
  arr.forEach(function(item) {
    if(deDuped.indexOf(item) < 0) {
      deDuped.push(item);
    }
  })*/
  return deDuped;
};


/**
  Checks for duplicates in an array
  Used in the testing suite to check
  if array of emails has any duplicates
  returns true if the (first)indexOf item[x]
  is not eq to the lastIndexOf that item

  returns {Boolean}

  params: arr {Array}
*/
function hasDuplicates(arr) {

  for(var x = 0; x <  arr.length; x++) {
    if(x !== arr.lastIndexOf(arr[x])) {
      return x !== arr.lastIndexOf(arr[x]);
    }
  }
  return;
};

/**
 Helper Function that compares input array which is being deduped to
 output array and determines if they are equivalent.  first it dedupes
 the input array and checks if the deduped arr and its output array
 are equivalent. If so the order has not mutated and thus the function
 returns true;

 returns {Boolean}

 params: inputedArr {Array} original array
 params: outputedArr {Array} resulting deduped array
*/
function isInOriginalOrderAfterDedupe(inputedArr, outputedArr) {
  inputedArr = removeDuplicates(inputedArr);
  return inputedArr.join(',') === outputedArr.join(',');
}

/**
Helper function to create DOM nodes and attach to html document.

side-effect: adds DOM to HTML document

params: options {Object}
  options: {
    htmlData: {Array}
    tag: {string}
    id: {string} *optional
    attrs: {Object} *optional
  }
*/
function createAndAppendDOM(options) {
  options.htmlData.forEach(function(item) {
    var node = document.createElement(options.tag);
    var val;

    if(options.attrs) {
      for(val in options.attrs) {
        node.setAttribute(val, options.attrs[val]);
      }
    }

    node.innerHTML = item;

    if (options.id) {
      document.getElementById(options.id).appendChild(node);
    } else {
      document.body.appendChild(node);
    }
  })
};

/** Helper function to create an array of data

returns: {Array}

params: arr {Array} //an array of strings used as basis to create the iterated  collector array
params: iterator {Number}
params: opt_str {String} *optional
*/
function createData(arr, iterator, opt_str) {
  let collector = [];
  for (var x=0; x<iterator; x++) {
    var randomNumber = Math.floor(Math.random() * arr.length);
    collector.push(`${arr[randomNumber]}${opt_str}`);
  }

  return collector;
};
