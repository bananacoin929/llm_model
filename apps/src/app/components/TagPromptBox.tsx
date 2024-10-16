import { Input, Select } from "rizzui";
import { BsArrowUpCircleFill, BsArrowDownCircleFill } from "react-icons/bs";
import { LLMChildren } from "../page";

type CustomGroupProps = {
  title: string;
  personalTags: Record<string, string | boolean>;
  promptText: string;
  keyInsert: any;
  seperator: string;
  curTagType: string;
  step: number;
  last: boolean;
  setCurTagType: (i: number, value: string) => void;
  onClickTag: (i: number) => void;
  onDelete: (i: number) => void;
  onChangePromptText: (i: number, value: string) => void;
  onChangeSeperator: (i: number, value: string) => void;
  handleOrderChildren: (i: number, action: number) => void;
};
export default function CustomTagGroupBox({
  personalTags,
  title,
  promptText,
  keyInsert,
  seperator,
  curTagType,
  step,
  last,
  setCurTagType,
  onClickTag,
  onDelete,
  onChangePromptText,
  onChangeSeperator,
  handleOrderChildren,
}: React.PropsWithChildren<CustomGroupProps>) {
  return (
    <>
      <div className="flex gap-5 items-center">
        <div className="w-30 flex flex-col gap-3 items-center">
          {last ? (
            <>
              <BsArrowUpCircleFill
                className="text-3xl cursor-pointer"
                onClick={() => handleOrderChildren(step - 1, 1)}
              />
              Step{step}
            </>
          ) : step == 1 ? (
            <>
              Step{step}
              <BsArrowDownCircleFill
                className="text-3xl cursor-pointer"
                onClick={() => handleOrderChildren(step - 1, -1)}
              />
            </>
          ) : (
            <>
              <BsArrowUpCircleFill
                className="text-3xl cursor-pointer"
                onClick={() => handleOrderChildren(step - 1, 1)}
              />
              Step{step}
              <BsArrowDownCircleFill
                className="text-3xl cursor-pointer"
                onClick={() => handleOrderChildren(step - 1, -1)}
              />
            </>
          )}
        </div>
        <div className="w-full border-solid p-2 relative rounded border border-black mt-1">
          <label
            style={{
              position: "absolute",
              top: -10,
              backgroundColor: "white",
              padding: "2px 5px 2px 5px",
              borderRadius: 5,
            }}
          >
            {title}
          </label>
          <div
            style={{
              margin: "10px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Input
              placeholder="Prompt Text"
              value={promptText}
              onChange={(e) => onChangePromptText(step - 1, e.target.value)}
            />
            <Select
              placeholder="Key Insert"
              options={keyInsert.map((item: any) => {
                return { value: item.type, label: item.type, disabled: false };
              })}
              value={curTagType}
              onChange={(selected: { value: string }) =>
                setCurTagType(step - 1, selected.value)
              }
              getOptionValue={(data) => data}
            ></Select>
            <div className="flex flex-row justify-between">
              <Input
                className="w-40"
                placeholder="Seperator"
                value={seperator}
                onChange={(e) => onChangeSeperator(step - 1, e.target.value)}
              />
              {/* <Button className="w-40">Seperator</Button> */}
              <div className="flex gap-5 items-end">
                <button
                  className="w-10 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                  onClick={() => onClickTag(step - 1)}
                >
                  Tags
                </button>
                {Object.keys(personalTags).length === 0 ||
                (Object.keys(personalTags).length === 1 &&
                  Object.keys(personalTags)[0] === "initlized") ? null : (
                  <div className="flex gap-1">
                    {Object.entries(personalTags)
                      .filter(([key]) => key !== "initlized")
                      .map(([key, value]) => (
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
                  className="w-16 h-6 outline outline-1 rounded-md outline-[#26AD60] text-[#26AD60]"
                  onClick={() => onDelete(step - 1)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
