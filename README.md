# MOU (MultiSearch Operator Utility)

MOU is an AI Interface that takes your wishes (e.g., ordering a coffee) and executes them through the internet (e.g., makes a Google Search for coffee, and automatically clicks the necessary links to buy the coffee for you). 

This project won the Most Innovative Solution Award at Neurathon 2023 of ML Club NIT Silchar, we being the only first years to get an award ;)

It is based on nat's [natbot](https://github.com/nat/natbot), but we also added an AI Avatar interface to the program.

## Presentation Video

The presentation video for the project is [here](https://youtu.be/-ql_tHxktoo)

## Brief working

For this, we use a terminal-controlled Chromium browser (using Playwright) which listens and forwards responses from the GPT model. The browser defaults to load the Google Search page upon loading and forward the page content to the backend, where the GPT model analyzes the incoming HTML. It ignores all the embedded scripts, markup, and other unnecessary tags to highlight only the main elements of the page.

When the user asks for anything, the model is trained to issue a search query which is most closely associated to attaining the user’s objective. The model continues the search by issuing another search query if no useful search results appear. The most matching search result is traversed similarly, ignoring the markup elements, and clicking the matching link.

The main idea behind constructing the prompt is assuming it to be an agent controlling a browser with given objectives and specific commands that it can issue on a webpage. Then we give examples of how the webpage looks like, and the associated command for that particular webpage. Provided a large dataset, the model can give fairly accurate associated commands. In addition to that, the model keeps track of all the previous conversations, so as to adjust the responses that result in a more positive feedback from the user. This way, it generates more and more responses that resonate with the user’s likes and dislikes.

## Platform
The Chromium browser is driven using Python3 and the OpenAI requests are made in NodeJS

