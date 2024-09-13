"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Title,
  Input,
  Loader,
  Button,
  Textarea,
  Select,
  Modal,
  Badge,
} from "rizzui";
import { useState, useEffect, ChangeEvent } from "react";
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
  updatePreviewPrompt,
  getInputJson,
  runPromptRequest,
} from "@/server/home";

// const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
//   ssr: false,
//   loading: () => (
//     <div className="grid h-10 place-content-center">
//       <Loader variant="spinner" />
//     </div>
//   ),
// });

export interface LLMChildren {
  friendlyname: string;
  keyInsert: string;
  llmChildType: string;
  nextOrder: number;
  order: number;
  personalityTags: Record<string, string | boolean>;
  prevOrder: number;
  promptText: string;
  seperator: string;
  uniqid: string;
}

interface RequestInfo {
  id: string;
  name: string;
  description: string;
  nextllmRequest: string;
  aiClient: string;
  responseJson: string;
  llmchildren: LLMChildren[];
}

type SelectType = {
  value: string;
  label: string;
  disabled: boolean;
  [key: string]: string | boolean;
};

interface TagJsonType {
  [key: string]: string;
}

export default function Home() {
  const [llmRequests, setRequests] = useState([]);
  const [apiObjects, setApiObjects] = useState([]);
  const [aiClients, setAIClients] = useState([]);
  const [curRequestInfo, setCurRequestInfo] = useState<RequestInfo>({
    id: "",
    name: "",
    description: "",
    nextllmRequest: "",
    aiClient: "",
    responseJson: "",
    llmchildren: [],
  });
  const [objectId, setObjectId] = useState("");
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [jsonText, setJsonText] = useState("");
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
  const [curTagType, setCurTagType] = useState<SelectType>({
    value: "",
    label: "",
    disabled: false,
  });
  const [curTagValue, setCurTagValue] = useState<SelectType>({
    value: "",
    label: "",
    disabled: false,
  });
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [tagSelector, setTagSelector] = useState([]);
  const [llmChildData, setllmChildData] = useState([]);

  const [tagJson, setTagJson] = useState<TagJsonType>({});
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

  const [selectedTag, setSelectedTag] = useState(-1);

  const [outputJson, setOutputJson] = useState("");

  const [outputImgs, setOutputImgs] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);

  const addTag = () => {
    if (selectedTag === -1) {
      const data = { ...tagJson, [curTagType.value]: curTagValue.value };
      setTagJson(data);
    } else {
      const llmRequestData = { ...curRequestInfo };
      const children = [...llmRequestData.llmchildren];
      const currentItem = children[selectedTag];

      currentItem.personalityTags[curTagType.value] = curTagValue.value;

      llmRequestData.llmchildren = children;

      setCurRequestInfo(llmRequestData);
    }
  };

  const addNewLLMChild = (type: string) => {
    const newChild: LLMChildren = {
      friendlyname: "",
      keyInsert: "",
      llmChildType: type,
      nextOrder: 0,
      order: llmChildData.length,
      personalityTags: { initlized: true },
      prevOrder: 0,
      promptText: type === "injector" ? "{0}" : "",
      seperator: "",
      uniqid: "",
    };

    const llmRequestData = { ...curRequestInfo };
    const children = [...llmRequestData.llmchildren, newChild];

    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  };

  const genInputJson = async () => {
    // 66ccee96cb2984594067aaca
    await getInputJson(curObject.value, objectId).then((res: any) => {
      setJsonText(
        JSON.stringify(
          {
            specific: res.specific,
            measurable: res.measurable,
            achievable: res.achievable,
            relevant: res.relevant,
          },
          null,
          4
        )
      );

      setInputJson({
        specific: res.specific,
        measurable: res.measurable,
        achievable: res.achievable,
        relevant: res.relevant,
      });
    });
  };

  const runPreviewPrompt = async () => {
    const data: any = {};
    data[curObject.value] = inputJson;

    updateJson(data, tagJson, curLLmRequest.value).then((result) => {
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

        // console.log(res)

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
        toast.error("Error has been occured.");
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

  const updatePreviewP = () => {
    updatePreviewPrompt(curRequestInfo).then(() => {
      runPreviewPrompt();
      // toast.success("Successfuly updated!");
    });
  };

  const onClickRunPromptRequest = () => {
    const data: any = {};
    data[curObject.value] = inputJson;
    setIsGenerating(true)
    updateJson(data, tagJson, curLLmRequest.value).then(() => {
      runPromptRequest(data, tagJson, curLLmRequest.value).then((res) => {
        // console.log(res)
        const queryTotal = res.queryTotal,
          displayResult = [];
        for (let i = 0; i < queryTotal; i++) {
          const query = res[`queryNo${i + 1}`];

          setIsGenerating(false);
          if (
            query.hasOwnProperty("response") &&
            query.response.hasOwnProperty("url")
          ) {
            displayResult.push(query.response.url);
          }
        }

        setOutputImgs(displayResult);
        setOutputJson(JSON.stringify(res, null, 2));
      });
    }).catch(err => console.log(err));
  };

  const onChangeTagpromptChildType = (index: number, value: string) => {
    const llmRequestData = { ...curRequestInfo };
    const children = [...llmRequestData.llmchildren];

    (children[index] as LLMChildren).keyInsert = value;
    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  };

  const onChangePromptText = (index: number, value: string) => {
    const llmRequestData = { ...curRequestInfo };
    const children = [...llmRequestData.llmchildren];

    (children[index] as LLMChildren).promptText = value;
    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  };

  const onChangeSeperator = (index: number, value: string) => {
    const llmRequestData = { ...curRequestInfo };
    const children = [...llmRequestData.llmchildren];

    (children[index] as LLMChildren).seperator = value;
    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  };

  const onChangeFriendlyName = (index: number, value: string) => {
    const llmRequestData = { ...curRequestInfo };
    const children = [...llmRequestData.llmchildren];

    (children[index] as LLMChildren).friendlyname = value;
    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  };

  const onChangeJsonText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
  };

  const onClickTagOnChildren = (index: number) => {
    setOpen(true);
    setSelectedTag(index);
  };

  const onDeleteChildren = (index: number) => {
    const llmRequestData = { ...curRequestInfo };
    const children = [
      ...llmRequestData.llmchildren.slice(0, index),
      ...llmRequestData.llmchildren.slice(index + 1),
    ];

    llmRequestData.llmchildren = children;

    setCurRequestInfo(llmRequestData);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurRequestInfo({ ...curRequestInfo, description: e.target.value });
  };

  const handleChangeResponseJson = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurRequestInfo({ ...curRequestInfo, responseJson: e.target.value });
  };

  const handleChangeAiClient = (v: SelectType) => {
    setCurRequestInfo({ ...curRequestInfo, aiClient: v.value });
  };

  const handleChangeNextLLM = (v: SelectType) => {
    setCurRequestInfo({ ...curRequestInfo, nextllmRequest: v.value });
  };

  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(window.setTimeout(updatePreviewP, 1000) as unknown as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curRequestInfo]);

  return (
    <>
      <Title>Update existing LLMObjects</Title>
      <div className="flex h-full mt-6">
        <div className="w-1/3 mr-6 flex flex-col h-full justify-between">
          <CustomGroupBox title="Select LLM Request">
            <Select
              className="pb-5 min-h-16"
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
                setOutputJson("");
                getLLMData(s.value);
              }}
            ></Select>
          </CustomGroupBox>
          <CustomGroupBox title="LLM Request Info">
            <Textarea
              placeholder="Description"
              value={curRequestInfo.description}
              onChange={handleChangeDescription}
            />
            <Select
              placeholder="AI Client"
              options={aiClients.map((item) => {
                return { value: item, label: item, disabled: false };
              })}
              value={curRequestInfo.aiClient}
              onChange={handleChangeAiClient}
            ></Select>
            <Textarea
              placeholder="ResponseJson-Format"
              aria-rowspan={5}
              value={curRequestInfo.responseJson}
              onChange={handleChangeResponseJson}
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
              onChange={handleChangeNextLLM}
            ></Select>
          </CustomGroupBox>
          <CustomGroupBox title="Toolbox">
            <Button
              className="bg-[#26AD60]"
              onClick={() => addNewLLMChild("text")}
            >
              Add Text Prompt
            </Button>
            <Button
              className="bg-[#26AD60]"
              onClick={() => addNewLLMChild("tagvalue")}
            >
              Add Tag Prompt
            </Button>
            <Button
              className="bg-[#26AD60]"
              onClick={() => addNewLLMChild("injector")}
            >
              Add Injector
            </Button>
          </CustomGroupBox>
        </div>
        <div className="flex flex-col w-full justify-between">
          <div>
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
                    onClick={() => {
                      setSelectedTag(-1);
                      setOpen(true);
                    }}
                  >
                    Tags
                  </button>
                  {Object.entries(tagJson).length === 0 ? null : (
                    <div className="flex gap-1">
                      {Object.entries(tagJson).map(([key, value]) => (
                        <span
                          key={key}
                          className="inline-block bg-[#26AD60] text-white rounded-full px-3 py-1 text-sm font-semibold"
                        >
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    className="w-20 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                    onClick={() => setIsOpen(true)}
                  >
                    InputJson
                  </button>
                </div>
                <div className="flex gap-5 items-end">
                  <button
                    className="h-6 px-1 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                    onClick={onClickRunPromptRequest}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Running ..." : "Run"}
                  </button>
                  {/* <button
                    className="w-16 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                    onClick={updatePreviewP}
                  >
                    Update
                  </button> */}
                </div>
              </div>
            </CustomGroupBox>
          </div>
          <div className="mt-8"></div>
          <div className="grid grid-cols-3 gap-5">
            <div
              className="overflow-y-auto flex flex-col gap-5 col-span-2"
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
                          onChangePromptText={onChangePromptText}
                          friendlyname={item.friendlyname}
                          onChangeFriendlyName={onChangeFriendlyName}
                          seperator={item.seperator}
                          onChangeSeperator={onChangeSeperator}
                          handleOrderChildren={handleOrderChildren}
                          onClickTag={onClickTagOnChildren}
                          onDelete={onDeleteChildren}
                          personalTags={
                            curRequestInfo.llmchildren[index].personalityTags
                          }
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
                          onChangePromptText={onChangePromptText}
                          seperator={item.seperator}
                          onChangeSeperator={onChangeSeperator}
                          handleOrderChildren={handleOrderChildren}
                          onClickTag={onClickTagOnChildren}
                          onDelete={onDeleteChildren}
                          personalTags={
                            curRequestInfo.llmchildren[index].personalityTags
                          }
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
                          onChangePromptText={onChangePromptText}
                          keyInsert={tagSelector}
                          seperator={item.seperator}
                          onChangeSeperator={onChangeSeperator}
                          curTagType={
                            (curRequestInfo.llmchildren[index] as LLMChildren)
                              .keyInsert
                          }
                          setCurTagType={onChangeTagpromptChildType}
                          handleOrderChildren={handleOrderChildren}
                          onClickTag={onClickTagOnChildren}
                          onDelete={onDeleteChildren}
                          personalTags={
                            curRequestInfo.llmchildren[index].personalityTags
                          }
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
            <div className="col-span-1">
              <CustomGroupBox title="Output">
                <Textarea
                  placeholder="Output Json"
                  value={outputJson}
                  onChange={() => null}
                />
                <div className="grid grid-cols-3">
                  {outputImgs.map((url, index) => (
                    <div key={index} className="col-span-1">
                      <Image
                        src={url}
                        alt="Image"
                        layout="responsive"
                        width={300}
                        height={300}
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </div>
              </CustomGroupBox>
            </div>
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
                setOpen(false);
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
            <Input
              className="w-30"
              placeholder="ObjectId"
              value={objectId}
              onChange={(e) => setObjectId(e.target.value)}
            />
          </div>
          <Textarea value={jsonText} onChange={onChangeJsonText} />
          <div className="flex flex-row w-full justify-end gap-3 mt-3 ">
            <Button
              className="bg-[#26AD60]"
              onClick={() => {
                genInputJson();
                // setIsOpen(false);
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
