Thanks for putting this demo together! Very cool concept! I decided to try out the HTML task first as it seems the most challenging. Then I tried out the recipe task.

## Good Features

* I like that the Decompose function tries to render the HTML code. It seems that I can also directly edit the HTML rendering.
* It’s also great to utilize both vertical and horizontal space. I can see multiple instances and modify them whenever I want to.
* Being able to regenerate a component multiple times is awesome.

## Suggestions

1. I’m not sure if it’s possible or useful, but maybe we can extend the decomposition pipeline beyond the viewport width? I think on my laptop things are a little cramped currently. This may also allow further decomposition of components.
2. Since there’s some randomness to the initial AI generation, parsing and rendering the code is quite challenging:

|  |  |
| --- | --- |
| ![A screenshot of a computer  AI-generated content may be incorrect.](data:image/png;base64...) | ![A screenshot of a computer  AI-generated content may be incorrect.](data:image/png;base64...) |
| (a) | (b) |

*Figure 1. Two instances of the same prompt. Parsing and rendering are both a little inconsistent.*

1. The buttons should probably show labels when we hover the cursor on them. The “edit” button can also be interpreted as “new prompt.” The “regenerate” button looks like “refresh.”
2. In the figure below, both “HTML Structure – Head Element” and “HTML Structure – Body Element” blocks are in edit mode. In the meantime, I’m trying to input a prompt for the latter. From a usability perspective, I wonder:
   1. Should we allow only one block to be in edit mode each time? What should we do when the user clicks out of the block being edited? Maybe we save it automatically?
   2. The select button and the confirm button in the edit mode are both checkmarks. Maybe we could differentiate them a bit more? I also think we could move the “select” checkmark to the left side of the block like a checkbox.
   3. I notice that the “regenerate” button is highlighted for the block I’m regenerating for, but it might not be obvious enough. Maybe we could just highlight the whole block and add the title of the block to the input window?
   4. During regeneration, it would be great if we could also see some animation?

![A screenshot of a computer  AI-generated content may be incorrect.](data:image/png;base64...)

*Figure 2. Regenerating a component. Note that there are two blocks in edit mode.*

1. In Figure 3 on the next page, the HTML parsing of the regenerated HTML seems a little off. Regenerating the component fixes it. It’s definitely very challenging to parse and render the code consistently, but it’s also a great concept!
2. In Figure 3 again, after selecting the components, the Final Output block does not actually show the full code.

![A screenshot of a computer  AI-generated content may be incorrect.](data:image/png;base64...)

*Figure 3. Regenerating the button and selecting output. I manually added “Hi” to test the edit mode.*

1. Small bugs:
   1. Unfortunately, the “Generate Final Output” button didn’t seem to work for me (Figure 4).
   2. The “Please select a model before sending a message” message doesn’t go away (Figure 5).

![A screenshot of a computer  AI-generated content may be incorrect.](data:image/png;base64...)

*Figure 4. “Generate Final Output” button.*

![A screenshot of a computer  AI-generated content may be incorrect.](data:image/png;base64...)

*Figure 5. Model selection prompt.*

* 1. I somehow broke the dark mode after a few HTML generations (the background became white).

1. I tried out the recipe prompt. I suppose the functionality is still in development, but replacing “chocolate chips” with “white chocolate chips and macadamia nuts” doesn’t update other components. Maybe we need a confirmation window for this.
2. Overall workflow:
   1. ‘Undo’ buttons may be necessary.
   2. Being able to reorder components might be nice. It’s not a very important feature for most use cases but can be helpful for coding and itemized lists.
   3. I wish there were a ‘Polish & Finalize’ button, so that the agent can take in my updated output once again and refine it. I suppose the newer LLMs should be able to retain most of the information? Also is this what “Generate Final Output” supposed to do?