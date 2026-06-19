# The Journey of EventHub: From Frustration to Innovation

## The Spark: A Campus Dilemma

My teammate and I always found it incredibly difficult to participate in the various events held on our campus by different clubs and committees. Sometimes we just didn't know an event was happening, but mostly, it was because of bad timing. 

I remember my friend really wanting to participate in a Debating Club event, but I was reluctant because our exams were fast approaching. It made me wonder: *Why do clubs hold events at times when students are studying and nobody can attend?* 

That thought led to a bigger idea: **What if we could build a system to suggest the optimal dates for clubs to hold their events?** Dates where they are guaranteed to get maximum participation, completely avoiding exams and major holidays.

## The Vision for Collaboration

The idea evolved further through my own experiences. Being a part of the Dance Club, I thought about how amazing it would be if the Music Club played live music while we performed. It hit me that many clubs on campus have massive potential to collaborate and scale their events—they just lack the necessary data because campus events aren't centralized. 

This Buildathon gave us the perfect excuse to finally take these lingering thoughts and turn them into reality. We started researching, polishing the idea, and eventually narrowed it down to three core features that would form the backbone of **EventHub**.

## The Hackathon Rollercoaster: Giving Up and Bouncing Back

Setting up the user interfaces for clubs and students was the easy part. The real challenge hit when I tried to figure out the algorithm for the date suggestion feature. I wanted to use the actual DAU academic calendar as our single source of truth, but I had absolutely no idea how to scrape the web.

I decided to try an AI coding assistant, **Cursor**, for the first time. It did pretty well initially, but I quickly hit its usage limit. Trying to implement the rest of the scraping logic on my own was exhausting. There was so much code I didn't understand, and the errors kept piling up. It felt like I had hit a brick wall.

In fact, the wall hit so hard that, just two days into the hackathon, my teammate and I decided to quit. We convinced ourselves that building something like this required knowing way more than we currently did.

But the story didn't end there. Fortunately, just a day after we "gave up," I discovered **Anti-Gravity**. With this new AI agent in our toolkit, we found the motivation to reboot the project. We tackled the core features, successfully scraped the DAU calendar, and ironed out the bugs that had previously stumped us.

## Final Decisions and the Finish Line

As we pushed toward the deadline, we had to make some strategic decisions. I was torn on whether to implement a full authentication system, but ultimately decided to build a "Role Switcher" with test users instead. This made it infinitely easier for users (and judges!) to test the product seamlessly without dealing with login friction.

I was also dreading the deployment phase, expecting it to be a massive headache. Surprisingly, deploying to Vercel turned out to be the easiest part of the whole project!

Now, on the final day, it's all about reflecting on the journey, writing the documentation, and finalizing this blog. EventHub went from a frustrating campus problem to a scrapped project, and finally, to a fully deployed platform. We learned that you don't need to know everything to build something great—you just need the right tools and the resilience to try again.
