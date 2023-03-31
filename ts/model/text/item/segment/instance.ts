import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import { Value } from "../../value.js";

import * as Item from "../instance.js";
import { Type as Item_Type } from "../type.js";
import * as Part from "../part.js";
import * as Split from "../split.js";

import { Type } from "./type.js";

export class Instance extends Item.Instance
{
    private segment_type: Type;
    private items: Array<Item.Instance>;

    constructor(
        {
            segment_type,
        }: {
            segment_type: Type,
        },
    )
    {
        super(
            {
                item_type: Item_Type.SEGMENT,
            },
        );

        this.segment_type = segment_type;
        this.items = [];
    }

    Segment_Type():
        Type
    {
        return this.segment_type;
    }

    Item_Count():
        Count
    {
        return this.items.length;
    }

    Has_Item(
        item: Item.Instance,
    ):
        boolean
    {
        return this.items.indexOf(item) > -1;
    }

    Has_Item_Index(
        item_index: Index,
    ):
        boolean
    {
        return (
            item_index > -1 &&
            item_index < this.items.length
        );
    }

    Item(
        item_index: Index,
    ):
        Item.Instance
    {
        Utils.Assert(
            this.Has_Item_Index(item_index),
            `Does not have an item at index ${item_index}.`,
        );

        return this.items[item_index];
    }

    Item_Index(
        item: Item.Instance,
    ):
        Index
    {
        const index: Index = this.items.indexOf(item);

        Utils.Assert(
            index > -1,
            `Does not have item.`,
        );

        return index;
    }

    Items():
        Array<Item.Instance>
    {
        return Array.from(this.items);
    }

    Try_Add_Item(
        item: Item.Instance,
    ):
        boolean
    {
        const segment_type: Type = this.Segment_Type();
        if (segment_type === Type.MICRO) {
            Utils.Assert(
                item.Is_Part() &&
                (
                    (item as Part.Instance).Is_Point() ||
                    (item as Part.Instance).Is_Letter() ||
                    (item as Part.Instance).Is_Marker() ||
                    (item as Part.Instance).Is_Command()
                ),
                `Can only add micro parts to a micro segment.`,
            );

            if (this.items.length === 0) {
                this.items.push(item);

                return true;
            } else {
                const part: Part.Instance = item as Part.Instance;
                const previous_part: Part.Instance =
                    this.items[this.items.length - 1] as Part.Instance;
                if (part.Is_Point()) {
                    if (previous_part.Is_Point()) {
                        this.items.push(part);

                        return true;
                    } else if (previous_part.Is_Letter()) {
                        return false;
                    } else if (previous_part.Is_Marker()) {
                        if (/\S+/.test(previous_part.Value())) {
                            this.items.push(part);

                            return true;
                        } else {
                            return false;
                        }
                    } else if (previous_part.Is_Command()) {
                        if ((previous_part as Part.Command.Instance).Is_Opening()) {
                            this.items.push(part);

                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        Utils.Assert(
                            false,
                            `Invalid previous_part_type.`,
                        );

                        return false;
                    }
                } else if (part.Is_Letter()) {
                    if (previous_part.Is_Point()) {
                        return false;
                    } else if (previous_part.Is_Letter()) {
                        this.items.push(part);

                        return true;
                    } else if (previous_part.Is_Marker()) {
                        if (/\S+/.test(previous_part.Value())) {
                            this.items.push(part);

                            return true;
                        } else {
                            return false;
                        }
                    } else if (previous_part.Is_Command()) {
                        if ((previous_part as Part.Command.Instance).Is_Opening()) {
                            this.items.push(part);

                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        Utils.Assert(
                            false,
                            `Invalid previous_part_type.`,
                        );

                        return false;
                    }
                } else if (part.Is_Marker()) {
                    if (previous_part.Is_Point()) {
                        this.items.push(part);

                        return true;
                    } else if (previous_part.Is_Letter()) {
                        this.items.push(part);

                        return true;
                    } else if (previous_part.Is_Marker()) {
                        if (/\S+/.test(previous_part.Value())) {
                            this.items.push(part);

                            return true;
                        } else {
                            return false;
                        }
                    } else if (previous_part.Is_Command()) {
                        this.items.push(part);

                        return true;
                    } else {
                        Utils.Assert(
                            false,
                            `Invalid previous_part_type.`,
                        );

                        return false;
                    }
                } else if (part.Is_Command()) {
                    if (previous_part.Is_Point()) {
                        if ((part as Part.Command.Instance).Is_Closing()) {
                            this.items.push(part);

                            return true;
                        } else {
                            return false;
                        }
                    } else if (previous_part.Is_Letter()) {
                        if ((part as Part.Command.Instance).Is_Closing()) {
                            this.items.push(part);

                            return true;
                        } else {
                            return false;
                        }
                    } else if (previous_part.Is_Marker()) {
                        if ((part as Part.Command.Instance).Is_Closing()) {
                            this.items.push(part);

                            return true;
                        } else {
                            if (/\S+/.test(previous_part.Value())) {
                                this.items.push(part);

                                return true;
                            } else {
                                return false;
                            }
                        }
                    } else if (previous_part.Is_Command()) {
                        this.items.push(part);

                        return true;
                    } else {
                        Utils.Assert(
                            false,
                            `Invalid previous_part_type.`,
                        );

                        return false;
                    }
                } else {
                    Utils.Assert(
                        false,
                        `Invalid part_type.`,
                    );

                    return false;
                }
            }
        } else if (segment_type === Type.MACRO) {
            Utils.Assert(
                (
                    item.Is_Part() &&
                    (
                        (item as Part.Instance).Is_Point() ||
                        (item as Part.Instance).Is_Word() ||
                        (item as Part.Instance).Is_Command()
                    )
                ) ||
                item.Is_Split(),
                `Can only add macro parts to a macro segment.`,
            );

            if (this.items.length === 0) {
                this.items.push(item);

                return true;
            } else {
                const previous_item: Item.Instance =
                    this.items[this.items.length - 1];
                if (item.Is_Part()) {
                    const part: Part.Instance = item as Part.Instance;
                    if (part.Is_Point()) {
                        if (previous_item.Is_Part()) {
                            const previous_part: Part.Instance = previous_item as Part.Instance;
                            if (previous_part.Is_Point()) {
                                this.items.push(part);

                                return true;
                            } else if (previous_part.Is_Word()) {
                                return false;
                            } else if (previous_part.Is_Command()) {
                                if ((previous_part as Part.Command.Instance).Is_Opening()) {
                                    this.items.push(part);

                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                Utils.Assert(
                                    false,
                                    `Invalid previous_part_type.`,
                                );

                                return false;
                            }
                        } else if (previous_item.Is_Split()) {
                            const previous_split: Split.Instance = previous_item as Split.Instance;
                            if (/\S+/.test(previous_split.Value())) {
                                this.items.push(part);

                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            Utils.Assert(
                                false,
                                `Invalid previous_item_type.`,
                            );

                            return false;
                        }
                    } else if (part.Is_Word()) {
                        if (previous_item.Is_Part()) {
                            const previous_part: Part.Instance = previous_item as Part.Instance;
                            if (previous_part.Is_Point()) {
                                return false;
                            } else if (previous_part.Is_Word()) {
                                return false;
                            } else if (previous_part.Is_Command()) {
                                if ((previous_part as Part.Command.Instance).Is_Opening()) {
                                    this.items.push(part);

                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                Utils.Assert(
                                    false,
                                    `Invalid previous_part_type.`,
                                );

                                return false;
                            }
                        } else if (previous_item.Is_Split()) {
                            const previous_split: Split.Instance = previous_item as Split.Instance;
                            if (/\S+/.test(previous_split.Value())) {
                                this.items.push(part);

                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            Utils.Assert(
                                false,
                                `Invalid previous_item_type.`,
                            );

                            return false;
                        }
                    } else if (part.Is_Command()) {
                        if (previous_item.Is_Part()) {
                            const previous_part: Part.Instance = previous_item as Part.Instance;
                            if (previous_part.Is_Point()) {
                                if ((part as Part.Command.Instance).Is_Closing()) {
                                    this.items.push(part);

                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (previous_part.Is_Word()) {
                                if ((part as Part.Command.Instance).Is_Closing()) {
                                    this.items.push(part);

                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (previous_part.Is_Command()) {
                                this.items.push(part);

                                return true;
                            } else {
                                Utils.Assert(
                                    false,
                                    `Invalid previous_part_type.`,
                                );

                                return false;
                            }
                        } else if (previous_item.Is_Split()) {
                            const previous_split: Split.Instance = previous_item as Split.Instance;
                            if ((part as Part.Command.Instance).Is_Closing()) {
                                this.items.push(part);

                                return true;
                            } else {
                                if (/\S+/.test(previous_split.Value())) {
                                    this.items.push(part);

                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        } else {
                            Utils.Assert(
                                false,
                                `Invalid previous_item_type.`,
                            );

                            return false;
                        }
                    } else {
                        Utils.Assert(
                            false,
                            `Invalid part_type.`,
                        );

                        return false;
                    }
                } else if (item.Is_Split()) {
                    const split: Split.Instance = item as Split.Instance;
                    if (previous_item.Is_Part()) {
                        const previous_part: Part.Instance = previous_item as Part.Instance;
                        if (previous_part.Is_Point()) {
                            this.items.push(split);

                            return true;
                        } else if (previous_part.Is_Word()) {
                            this.items.push(split);

                            return true;
                        } else if (previous_part.Is_Command()) {
                            this.items.push(split);

                            return true;
                        } else {
                            Utils.Assert(
                                false,
                                `Invalid previous_part_type.`,
                            );

                            return false;
                        }
                    } else if (previous_item.Is_Split()) {
                        const previous_split: Split.Instance = previous_item as Split.Instance;
                        if (/\S+/.test(previous_split.Value())) {
                            this.items.push(split);

                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        Utils.Assert(
                            false,
                            `Invalid previous_item_type.`,
                        );

                        return false;
                    }
                } else {
                    Utils.Assert(
                        false,
                        `Unknown item_type.`,
                    );

                    return false;
                }
            }
        } else {
            Utils.Assert(
                false,
                `Unknown segment_type.`,
            );

            return false;
        }
    }

    Add_Item(
        item: Item.Instance,
    ):
        void
    {
        const result: boolean = this.Try_Add_Item(item);

        Utils.Assert(
            result === true,
            `Failed to add item.`,
        );
    }

    override Value():
        Value
    {
        let value: string = ``;

        for (const item of this.items) {
            value += item.Value();
        }

        return value;
    }
}
