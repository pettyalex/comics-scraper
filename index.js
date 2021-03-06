addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

var imgSrc

class PictureHandler {
  element(element) {
    console.log("MATCHED ELEMENT")
    console.log(element)
    const src = element.getAttribute("src")
    console.log(src)
    imgSrc = src
  }

  comments(comment) {
    console.log(comment)

  }

  text(text) {
    console.log(text)
  }
}

const rewriter = new HTMLRewriter().on(
  "picture.item-comic-image > img", new PictureHandler()
)

// const domParser = DOMParser();

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const { pathname, searchParams } = new URL(request.url)
  const [_, comic, year, month, day] = pathname.split('/') // /comicName/year/month/day

  console.log(`making a request to https://www.gocomics.com${pathname}`)
  const goComicsFetch = await fetch(`https://www.gocomics.com${pathname}`)
  
  console.log(goComicsFetch.status)
  if (goComicsFetch.status != 200) {
    return new Response(undefined, {
      status: goComicsFetch.status
    })
  }
  // console.log(await goComicsFetch.text())
  // const goComicsHtml = await goComicsFetch.text()

  const res = rewriter.transform(goComicsFetch)
  await res.text()

  // const comicDoc = domParser.parseFromString(goComicsHtml)
  // const imgSrc = comicDoc.querySelector("picture.item-comic-image > img").src

  if (!imgSrc) {
    return new Response(undefined, {
      status: 404
    })
  }
  const imgRes = await fetch(imgSrc)
  return imgRes
}


