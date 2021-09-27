import { html, render, makeComponent } from './makeComponent.js';

const onConstruct = host => {
  host.useState({
    greeting: "hello",
    place: "usa",
    show: true,
    wordCount: 0,
    objTest: { x: 10, y: 0 },
  })
}

const styles = html`
  <style>
    h1 {
      color: red;
    }
  </style>
`

const template = (host) => {
  const { place, greeting, show } = host;

  return html`
  ${styles}
  ${ show ?
      html`
        <h1 @click=${e => place === "usa" ? host.place = "worlds" :  host.place = "usa"}>
          ${ greeting } ${ place }!
        </h1>
      ` : ""
  }
    <button @click=${e => {
      host.show = !host.show;
      // host.mergeProp("objTest", { x: 3 });
      host.objTest = {...host.objTest, x: 3};
      // host.setProp("objTest", {x: 4});
    }}>show/hide</button>
    <br/>
    <br/>
    <textarea @input=${e => host.wordCount = e.target.value.split(/\s+/).length}></textarea>
    <div>there are ${host.wordCount} words</div>
    <div>x is ${host.objTest.x}, y is ${host.objTest.y}</div>
  `
}

makeComponent({
  name: "test-comp",
  template,
  onConstruct
})