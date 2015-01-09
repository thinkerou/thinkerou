##GitHub Flavored Markdown
GitHub uses "GitHub Flavored Markdown," or GFM, across the site--in issues, comments, and pull requests. It differs from standard Markdown (SM) in a few significant ways, and adds some additional functionality.

If you're not already familiar with Markdown, take a look at Markdown Basics. If you'd like to know more about features that are available in issues, comments, and pull request descriptions, such as task lists, read Writing on GitHub.

Differences from traditional Markdown

Multiple underscores in words

Where Markdown transforms underscores (_) into italics, GFM ignores underscores in words, like this:

wow_great_stuff
do_this_and_do_that_and_another_thing.
This allows code and names with multiple underscores to render properly. To emphasize a portion of a word, use asterisks (*).

##URL autolinking

GFM will autolink standard URLs, so if you want to link to a URL (instead of setting link text), you can simply enter the URL and it will be turned into a link to that URL.

    http://example.com

becomes

http://example.com

##Strikethrough

GFM adds syntax to create strikethrough text, which is missing from standard Markdown.

    ~~Mistaken text.~~

becomes

~~Mistaken text.~~

##Fenced code blocks

Standard Markdown converts text with four spaces at the beginning of each line into a code block; GFM also supports fenced blocks. Just wrap your code in ``` (as shown below) and you won't need to indent it by four spaces. Note that although fenced code blocks don't have to be preceded by a blank line—unlike indented code blocks—we recommend placing a blank line before them to make the raw Markdown easier to read.

Here's an example:

```
function test() {
  console.log("notice the blank line before this function?");
}
```

Keep in mind that, within lists, you must indent non-fenced code blocks eight spaces to render them properly.

##Syntax highlighting

Code blocks can be taken a step further by adding syntax highlighting. In your fenced block, add an optional language identifier and we'll run it through syntax highlighting. For example, to syntax highlight Ruby code:

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```
We use Linguist to perform language detection and syntax highlighting. You can find out which keywords are valid by perusing the languages YAML file.

##Tables

You can create tables by assembling a list of words and dividing them with hyphens - (for the first row), and then separating each column with a pipe |:

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
For aesthetic purposes, you can also add extra pipes on the ends:

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
Note that the dashes at the top don't need to match the length of the header text exactly:

| Name | Description          |
| ------------- | ----------- |
| Help      | Display the help window.|
| Close     | Closes a window     |
You can also include inline Markdown such as links, bold, italics, or strikethrough:

| Name | Description          |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |
Finally, by including colons : within the header row, you can define text to be left-aligned, right-aligned, or center-aligned:

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |
A colon on the left-most side indicates a left-aligned column; a colon on the right-most side indicates a right-aligned column; a colon on both sides indicates a center-aligned column.
