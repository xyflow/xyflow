//all imports
import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useCallback
  } from "react";
  import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls
  } from "react-flow-renderer";
  import "./dnd.css";
  
  import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
  
  const themes = {
    light: {
      foreground: "#000000",
      background: "#eeeeee"
    },
    dark: {
      foreground: "#ffffff",
      background: "#222222"
    }
  };
  
  const ThemeContext = React.createContext(themes.light);
  
  // import Sidebar from "./sidebar";
  // data
  const initialElements = [
    {
      id: "1",
      type: "input",
      data: { label: "Connect Boxes Then Click for order  Here" },
      position: { x: 250, y: 5 },
      style: { background: "#ffcc50", width: 300, borderRadius: 100 }
      // isHidden: true
    }
  ];
  
  let id = 0;
  
  //all styles
  
  const flowStyle = { height: 1000 };
  
  const DnDFlow = () => {
    //useStates here
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    //if is removed 3  of them false then show all again
    const [isRemoved1, setIsRemoved1] = useState(true);
    const [isRemoved2, setIsRemoved2] = useState(true);
    const [isRemoved3, setIsRemoved3] = useState(true);
    const [isAll, setIsAll] = useState(false);
    const [isRemovedMain, setisRemovedMain] = useState(true);
    const [paramsConcated, setparamsConcated] = useState("");
    const [elementOne, setElementOne] = useState(false);
    const [elementTwo, setElementTwo] = useState(false);
    const [elementThree, setElementThree] = useState(false);
    //changes value without rerendering component
    //intial value is 1
    //console.log object to use it
    //default is current
    const rerenderCount = useRef(0);
  
    //this useEffect does not require any depdency
    // useref stores object
  
    useEffect(() => {
      rerenderCount.current = rerenderCount.current + 1;
    });
  
    // all hooks here
  
    useEffect(() => {
      setElements((els) =>
        els.map((el) => {
          if (el.id === "dndnode_0") {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.style = { ...el.style, backgroundColor: "#ffcc50" };
          }
  
          return el;
        })
      );
    }, [elementOne, setElementOne]);
    //same as useEffect just replace it by memo
    //here it is one condition so useMemo works fine
    useMemo(() => {
      setElements((els) =>
        els.map((el) => {
          if (el.id === "dndnode_1") {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.style = { ...el.style, backgroundColor: "#ffcc50" };
          }
  
          return el;
        })
      );
    }, [elementTwo, setElementTwo]);
  
    //same as useMemo but does not rerender
    useMemo(() => {
      setElements((els) =>
        els.map((el) => {
          if (el.id === "dndnode_2") {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            el.style = { ...el.style, backgroundColor: "#ffcc50" };
          }
  
          return el;
        })
      );
    }, [elementThree, setElementThree]);
  
    //other hooks here
  
    //declaring a variable to be used by other functions
    // let paramsToUse = "";
    //all functions
  
    const onConnect = (params) => {
      setparamsConcated(paramsConcated.concat(params.target + ", "));
      console.log(paramsConcated);
  
      if (params.target === "dndnode_0" || "") {
        setElementOne(true);
      } else if (params.target === "dndnode_1") {
        setElementTwo(true);
      } else if (params.target === "dndnode_2") {
        setElementThree(true);
      }
  
      if (elementOne && elementTwo && elementThree === false) {
        alert("now you can procceed");
      }
  
      return [
        params,
        setElements((els) => {
          return addEdge(params, els);
        })
      ];
    };
  
    const onElementsRemove = (elementsToRemove) => {
      switch ((isRemoved1, isRemoved2, isRemoved3)) {
        case !isRemoved1:
          setIsRemoved1(true);
          break;
        case !isRemoved2:
          setIsRemoved2(true);
          break;
        case isRemoved3:
          setIsRemoved3(true);
          break;
        default:
          // setIsAll(true);
          console.log(isAll);
      }
  
      // if (isRemoved3) {
      //   setIsRemoved3(false);
      // }
  
      return setElements((els) => {
        return removeElements(elementsToRemove, els);
      });
    };
  
    const getId = () => `dndnode_${id++}`;
  
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    };
  
    const onLoad = (_reactFlowInstance) =>
      setReactFlowInstance(_reactFlowInstance);
  
    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    };
  
    const onDrop = (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const dataLabel = type;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top
      });
  
      // console.log(type);
      const newNode = {
        id: getId(),
        type: "output",
        position,
        data: { label: dataLabel }
      };
  
      setElements((es) => es.concat(newNode));
  
      switch ((isRemoved1, isRemoved2, isRemoved3)) {
        case isRemoved1:
          setIsRemoved1(false);
          break;
        case isRemoved2:
          setIsRemoved2(false);
          break;
        case isRemoved3:
          setIsRemoved3(false);
          break;
        default:
          console.log("nothing moved from the sidebar");
      }
  
      // if (dataLabel === "ProofOfAddress") {
      //   // add ENUM for values better
      //   setIsRemoved(false);
      // }  if (dataLabel === "Country") {
      //   setIsRemoved(false);
      // }  if (dataLabel === "Passport") {
      //   setIsRemoved(false);
      // }  if (dataLabel === "Four") {
      //   setIsRemoved(false);
      // }
    };
  
    //pass data from a function to another
    const onSubmit = () => {
      // paramsConcated = "dndnode_0,";
      console.log(paramsConcated);
  
      if (paramsConcated === "dndnode_0, dndnode_1, ") {
        alert("please connect all before proceeding");
      } else if (paramsConcated === "dndnode_0, dndnode_2, ") {
        alert("please connect all before proceeding");
      } else if (paramsConcated === "dndnode_1, dndnode_0, ") {
        alert("please connect all before proceeding");
      } else if (paramsConcated === "dndnode_1, dndnode_2, ") {
        alert("please connect all before proceeding");
      } else if (paramsConcated === "dndnode_2, dndnode_0, ") {
        alert("please connect all before proceeding");
      } else if (paramsConcated === "dndnode_2, dndnode_1, ") {
        alert("please connect all before proceeding");
      }
  
      // if (paramsToUse === "dndnode_0, ") {
      //   alert("not filled yet");
      // } else if (paramsToUse === "dndnode_1") {
      //   alert("not filled yet");
      // } else if (paramsToUse === "dndnode_2") {
      //   alert("not filled yet");
      // }
  
      // console.log(`params used on the click ${paramsToUse}`);
  
      // if (paramsConcated === "dndnode_0, dndnode_1, dndnode_2,") {
      //   alert("wrong");
      // }
  
      // else {
      //   alert("Success");
      // }
    };
  
    return (
      //All return
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              style={flowStyle}
              elements={elements}
              onConnect={onConnect}
              onElementsRemove={onElementsRemove}
              onLoad={onLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
            ></ReactFlow>
          </div>
          <aside>
            {isRemoved1 && (
              <div
                className="dndnode output"
                onDragStart={(event) => onDragStart(event, "ProofOfAddress")}
                // onNodeDragStop={onNodeDragStop}
                draggable
              >
                Proof of address
              </div>
            )}
            {isRemoved2 && (
              <div
                className="dndnode output"
                onDragStart={(event) => onDragStart(event, "Country")}
                draggable
              >
                Country
              </div>
            )}
            {isRemoved3 && (
              <div
                className="dndnode output"
                onDragStart={(event) => onDragStart(event, "Passport")}
                draggable
              >
                Passport
              </div>
            )}
            <button onClick={onSubmit}>Press To Confirm</button>
            <div>Times this component rerendering {rerenderCount.current}</div>
          </aside>
          )
        </ReactFlowProvider>
      </div>
    );
  };
  
  export default DnDFlow;
  