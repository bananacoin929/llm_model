"use client";

import dynamic from "next/dynamic";
import { Title, Input, Loader, Button, Textarea, Select, Modal } from "rizzui";
import { useState, useEffect, act } from "react";
import CustomGroupBox from "@/app/components/CustomGroupBox";
import TextBox from "@/app/components/TextBox";
import TagPromptBox from "@/app/components/TagPromptBox";
import InjectorBox from "@/app/components/InjectorBox";
import { BsArrowUpCircleFill, BsArrowDownCircleFill } from "react-icons/bs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import {
  getHomeData,
  getLLmRequestInfo,
  updateJson,
  getInputJson,
} from "@/server/home";

// const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
//   ssr: false,
//   loading: () => (
//     <div className="grid h-10 place-content-center">
//       <Loader variant="spinner" />
//     </div>
//   ),
// });

export default function Home() {
  const [llmRequests, setRequests] = useState([]);
  const [apiObjects, setApiObjects] = useState([]);
  const [aiClients, setAIClients] = useState([]);
  const [curRequestInfo, setCurRequestInfo] = useState({
    id: "",
    name: "",
    description: "",
    nextllmRequest: "",
    aiClient: "",
    responseJson: "",
    llmchildren: [],
  });
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [curLLmRequest, setCurLLmRequest] = useState({
    value: "NudgeGoal",
    label: "NudgeGoal",
    disabled: false,
  });
  const [curAIClient, setCurAIClient] = useState({
    value: "",
    label: "",
    disabled: false,
  });
  const [curNextRequest, setCurNextRequest] = useState({
    value: "",
    label: "",
    disabled: false,
  });
  const [tags, setTags] = useState({});
  const [curTagType, setCurTagType] = useState({
    value: "",
    label: "",
    disabled: false,
  });
  const [curTagValue, setCurTagValue] = useState({
    value: "",
    label: "",
    disabled: false,
  });
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [tagSelector, setTagSelector] = useState([]);
  const [llmChildData, setllmChildData] = useState([]);
  const [injectorData, setInjectorData] = useState({
    promptText: "",
    friendlyname: "",
    seperator: "",
  });
  const [textData, setTextData] = useState({
    promptText: "",
    seperator: "",
  });
  const [tagvalue, setTagValue] = useState({
    promptText: "",
    seperator: "",
  });
  const [tagJson, setTagJson] = useState({});
  const [curObject, setCurObject] = useState({
    value: "",
    label: "",
    disabled: false,
  });
  const [inputJson, setInputJson] = useState({
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
  });
  const addTag = () => {
    const data: any = {};
    data[curTagType.value] = curTagValue.value;
    setTagJson(data);
  };

  const genInputJson = async () => {
    await getInputJson(curObject.value, "66ccee96cb2984594067aaca").then(
      (res: any) => {
        setInputJson({
          specific: res.specific,
          measurable: res.measurable,
          achievable: res.achievable,
          relevant: res.relevant,
        });
      }
    );
  };

  const runPreviewPrompt = async () => {
    const data: any = {};
    data[curObject.value] = inputJson;

    updateJson(data, tagJson, curLLmRequest.value).then((result) => {
      console.log(result)
      setPreviewPrompt(result);
    });
  };
  const getLLMData = async (param: string) => {
    await getLLmRequestInfo(param).then((res: any) => {
      setCurRequestInfo({
        id: res.id,
        name: res.name,
        description: res.description,
        nextllmRequest: res.nextllmRequest,
        aiClient: res.aiClient,
        responseJson: res.responseJson,
        llmchildren: res.llmchildren,
      });
    });
  };

  useEffect(() => {
    getHomeData()
      .then((res: any) => {
        const tagSelector: any = Object.keys(res.tags).map((key) => ({
          type: key,
          values: res.tags[key],
        }));

        setRequests(res.llmRequestNames);
        setAIClients(res.aiClients);
        setTags(res.tags);
        setTagSelector(tagSelector);
        setApiObjects(res.apiObjects);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Server is not working");
      });

    getLLMData("NudgeGoal");
  }, []);

  /*
   * index: number, action: 1(up) -1(down)
   */
  // (index, 1) => index->index-1 index-1->index
  const handleOrderChildren = (index: number, action: number) => {
    const llmRequestData = { ...curRequestInfo };
    const children = [...llmRequestData.llmchildren];
    const currentItem = children[index];

    children[index] = children[index - action];
    children[index - action] = currentItem;
    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  };

  const updatePreviewPrompt = () => {
    axios
      .put(process.env.NEXT_PUBLIC_LLM_API + "api/LLMRequest", curRequestInfo)
      .then(() => {
        runPreviewPrompt();
		toast.success("Successfuly updated!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeTagpromptChildType = (index: number, value: string) => {
    const llmRequestData = { ...curRequestInfo };
    const children = [...llmRequestData.llmchildren];

    children[index].keyInsert = value;
    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  }

  return (
    <>
      <Title>Update existing LLMObjects</Title>
      <div className="flex h-full">
        <div className="w-1/3 mr-6 flex flex-col h-full justify-between">
          <CustomGroupBox title="Select LLM Request">
            <Select
              className="pb-5"
              placeholder=""
              options={llmRequests?.map((item) => {
                return { value: item, label: item, disabled: false };
              })}
              value={curLLmRequest.value}
              onChange={(s: any) => {
                setCurLLmRequest({
                  value: s.value,
                  label: s.label,
                  disabled: false,
                });
                getLLMData(s.value);
              }}
            ></Select>
          </CustomGroupBox>
          <CustomGroupBox title="LLM Request Info">
            <Textarea
              placeholder="Description"
              value={curRequestInfo.description}
              onChange={() => null}
            />
            <Select
              placeholder="AI Client"
              options={aiClients.map((item) => {
                return { value: item, label: item, disabled: false };
              })}
              value={curRequestInfo.aiClient}
              onChange={setCurAIClient}
            ></Select>
            <Textarea
              placeholder="ResponseJson-Format"
              aria-rowspan={5}
              value={curRequestInfo.responseJson}
              onChange={() => null}
            />
            <Select
              placeholder="Next LLM Request"
              options={llmRequests.reduce((acc: any, item) => {
                if (item !== curLLmRequest.value) {
                  acc.push({ value: item, label: item, disabled: false });
                }
                return acc;
              }, [])}
              value={curRequestInfo.nextllmRequest}
              onChange={setCurNextRequest}
            ></Select>
          </CustomGroupBox>
          <CustomGroupBox title="Toolbox">
            <Button className="bg-[#26AD60]">Add Text Prompt</Button>
            <Button className="bg-[#26AD60]">Add Tag Prompt</Button>
            <Button className="bg-[#26AD60]">Add Injector</Button>
          </CustomGroupBox>
        </div>
        <div className="flex flex-col w-full justify-between">
          <CustomGroupBox title="Preview Prompt">
            <Textarea
              placeholder="Prompt Text"
              textareaClassName=" h-10"
              value={previewPrompt}
              onChange={() => null}
            />
            <div className="flex flex-row justify-between w-full">
              <div className="flex gap-5 items-end">
                {/* <Button className="w-32 h-8 bg-[#26AD60]">Seed</Button> */}
                <Input
                  className="w-32"
                  placeholder="Seed"
                  onChange={() => null}
                />
                <button
                  className="w-10 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                  onClick={() => setOpen(true)}
                >
                  Tags
                </button>
                <button
                  className="w-20 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                  onClick={() => setIsOpen(true)}
                >
                  InputJson
                </button>
              </div>
              <div className="flex gap-5 items-end">
                <button
                  className="w-10 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                  onClick={runPreviewPrompt}
                >
                  Run
                </button>
                <button
                  className="w-16 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                  onClick={updatePreviewPrompt}
                >
                  Update
                </button>
              </div>
            </div>
          </CustomGroupBox>
          <div
            className="overflow-y-auto flex flex-col gap-5"
            style={{ height: "calc(100vh - 315px)" }}
          >
            {curRequestInfo ? (
              curRequestInfo.llmchildren?.map((item: any, index: number) => {
                switch (item.llmChildType) {
                  case "injector":
                    return (
                      <InjectorBox
                        key={index + 1}
                        step={index + 1}
                        last={curRequestInfo.llmchildren.length - 1 == index}
                        title="Injector"
                        promptText={item.promptText}
                        friendlyname={item.friendlyname}
                        seperator={item.seperator}
                        handleOrderChildren={handleOrderChildren}
                      ></InjectorBox>
                    );
                  case "text":
                    return (
                      <TextBox
                        key={index + 1}
                        step={index + 1}
                        last={curRequestInfo.llmchildren.length - 1 == index}
                        title="text"
                        promptText={item.promptText}
                        seperator={item.seperator}
                        handleOrderChildren={handleOrderChildren}
                      ></TextBox>
                    );
                  case "tagvalue":
                    return (
                      <TagPromptBox
                        key={index + 1}
                        step={index + 1}
                        last={curRequestInfo.llmchildren.length - 1 == index}
                        title="Tagprompt"
                        promptText={item.promptText}
                        keyInsert={tagSelector}
                        seperator={item.seperator}
                        curTagType={curRequestInfo.llmchildren[index].keyInsert}
                        setCurTagType={onChangeTagpromptChildType}
                        handleOrderChildren={handleOrderChildren}
                      ></TagPromptBox>
                    );
                  default:
                    return <></>;
                }
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="p-5">
          <Title
            as="h3"
            className="text-lg font-semibold xl:text-xl border-b-4 border-gray-400 border-dotted"
          >
            Tag Selector
          </Title>
          <div className="flex flex-row p-10 w-full justify-between ">
            <Select
              className="w-36"
              placeholder="Tag List"
              options={tagSelector.map((item: any) => {
                return { value: item.type, label: item.type, disabled: false };
              })}
              value={curTagType.value}
              onChange={setCurTagType}
            ></Select>
            <Select
              className="w-36"
              options={tagSelector.flatMap((item: any) => {
                if (item.type == curTagType.value) {
                  return item.values.map((res: any) => ({
                    value: res,
                    label: res,
                    disabled: false,
                  }));
                }
                return [];
              })}
              placeholder="Tag Values"
              value={curTagValue.value}
              onChange={setCurTagValue}
            ></Select>
          </div>
          <div className="flex flex-row w-full justify-end gap-3 border-t-4 border-gray-400 pt-2 border-dotted">
            <Button
              className="bg-[#26AD60]"
              onClick={() => {
                addTag();
                setOpen(false)
              }}
            >
              Add
            </Button>
            <Button className="bg-[#26AD60]" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-5">
          <Title
            as="h3"
            className="text-lg font-semibold text-gray-900 xl:text-xl border-b-4 border-gray-400 border-dotted"
          >
            Input Json
          </Title>
          <div className="flex flex-row p-10 w-full justify-between">
            <Select
              className="w-36"
              placeholder="Object"
              options={apiObjects.map((item: any) => {
                return { value: item, label: item, disabled: false };
              })}
              value={curObject.value}
              onChange={(s: any) => {
                setCurObject({
                  value: s.value,
                  label: s.label,
                  disabled: false,
                });
              }}
            ></Select>
            <Input className="w-30" placeholder="ObjectId" />
          </div>
          <Textarea />
          <div className="flex flex-row w-full justify-end gap-3 mt-3 ">
            <Button
              className="bg-[#26AD60]"
              onClick={() => {
                genInputJson();
                setIsOpen(false)
              }}
            >
              Add
            </Button>
            <Button className="bg-[#26AD60]" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <div>
        <Toaster />
      </div>
    </>
  );
}
