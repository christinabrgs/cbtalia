---
title: Building a CLI, Septa API Pains, & Unmarshalling 
slug: septa-cli
publishDate: 01 March 2026
description: A journey through building a CLI on top of a public API (SEPTA by popular vote) in Go.

---



# Building a CLI, Septa API Pains, & Unmarshalling

[PHL Code Club](https://phlcode.club?utm_source=chris-blog) hosted their first mini hack night on Wednesday, January 28th, Let's Build it {Period}. It was a night full of creative minds coming together and building simply for the joy of creating. (Maybe I am biased considering I helped organize the event). But I particularly enjoyed experiencing the event in the shoes of an attendee and participating in the activities.

## The Goal for the Night?

Utilize a public API (SEPTA by popular vote) and build something, anything! in the next hour and a half.

At first, I thought I would try my hand at data visualization for this but then the idea of building a CLI (Command Line Interface) was suggested... creating a client for the terminal? Hell Yeah.

In terms of coding, this process was pretty straight forward. On the other hand, SEPTA docs were not. I admittedly spent a majority of my time reading through under developed documentation. It took me digging up data from 2023 to get a full description of the API fields I needed. If anyone at Septa is reading this, please update your docs.

But I digress, back to the building of the CLI...

## Setting Up a CLI Project with Go and Cobra CLI

To begin, you should have Go installed. You can check this by running:

```bash
go version
```

This should output the version of go you are running. If it is not installed, then head over to the [go docs](https://go.dev/dev/install) before reading on.

Cobra will also need to be installed:

```bash
go install github.com/spf13/cobra-cli
```  (this package generates your cobra application, taking care of set up so you can focus on writing your command logic)

Once Go and Cobra are installed, we can initialize our project!
```bash
go mod init
```

Next, we need to initialize the cobra application:

```bash
cobra-cli init
```

add a new command:

```bash
cobra-cli add command
```

run the command:

```bash
./project command
```

and there you go, you have a basic template to get started! Yayyy, air five if you're still with me!

_also check out the github repo for a more indepth walkthrough of setting up with [Cobra-cli](https://github.com/spf13/cobra-cli)_

### Adding Your Own Logic

This is where the fun part begins; adding your own logic for your commands! For this app we are making an HTTP GET request to fetch the time for the next scheduled bus.

Here are the basic steps:

1. Make a http.get request to the SEPTA API  
2. Structure the returned data
3. Display it on the command line

easyyyy right? at least so I thought...

#### Enter Road Block

This is where we ran into an issue, some of the data being fetched was _**not**_ displaying as expected. In order to troubleshoot this issue, we can add some println's to see what is going on with the data at each step of the program. Luckily, after review, the GET request was working as intended. So, what was the issue? At first glance, this wasn't so obvious.

Then it clicked, the Time field in the go struct was an empty string, hence the reason it was not translating to the table in the terminal. All other fields were being fetched as expected.

For reference, our go struct is written as

```go
type Arrival struct {
 StopName      string
 Route         string
 Time          string 
 Day           string
 DirectionDesc string
}
```

while the septa JSON object is written as

```json
{
"StopName":"",
"Route":"",
"date":"",
"day":"",
"Direction":"",
}
```

can you see the bug? .-.

## Unmarshalling

This is when knowing how Go processes data is important, specifically the **unmarshal** method from the **encoding/json** package. So let's talk about how this function works.

**Definition** Unmarshalling is the process of unpacking data from one source and reconstructing that data into a structure your program can use.

In Go, the unmarshal function specifically takes a JSON encoded string, unpacks it, and converts it into a Go struct.

the code looks as follows:

```go
func Unmarshal(in []byte, out any, opts ...Options) (err error)
```

In our list of arguments, we have, **in**, this must be a single JSON value and, **out**, a non-nil pointer.

The input is then decoded into the output type. This works through Go's underlying mapping mechanism which will match the JSON key name to the Go Struct field value (the field value must be exported, which is denoted by a starting capital letter, for this to work).

If a JSON's key does not have a matching field name, the unmarshalling method will skip over the value in the JSON and the Struct field will be a zero value. Were you able to spot the bug in the previous section? In our Arrival struct, we have the Time field. In the SEPTA JSON object, the key is "Date". Unmarshal cannot map this data... which means our struct will instead receive a zero value on the Time field.

How can we prevent this? That's where tagging Go struct fields ahead of time comes in handy.

In our Arrival struct, we need to tag **json:"Date"** to the Time field in order for the unmarshaller to properly match the key to the field.

```go
type Arrival struct {
 StopName      string
 Route         string
 Time          string `json:"Date"`
 Day           string
 DirectionDesc string
}
```

One small change and wam bam, we have a properly decoded JSON object ready to go...

## Closing Note

One of the best ways to learn is by writing buggy code. Yes, it can be frustrating when you don't know what's going on or why your program is not running as expected. I know I'm guilty of letting the frustration get to me. But when you do take a moment to step back, you realize that some really fun lessons can come from a small hiccup in your code.

Resources:

[GoByExample](https://gobyexample.com/json)

[Unmarshal Docs](https://pkg.go.dev/encoding/json/v2#Unmarshal)

[Graham's Brain](https://gvasquez.dev/?utm_source=chris-blog) (thank you for always helping me break down every line of code until I understand exactly what's going on)
