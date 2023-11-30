import { useRouter, Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  UseFieldArrayReturn,
} from "react-hook-form";
import { Text, View, StyleSheet, TextInput, Button, Alert } from "react-native";
import { ScrollView } from "tamagui";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface FormValues {
  name: string;
  mins_prep: string;
  mins_cook: string;
  description: string;
  default_servings: string;
  procedure: string;
  created_at: string;
  author_id: string;
  tags: { key: string; value: string }[];
  ingredients: {
    quantity: string;
    unit: string;
    name: string;
    storage: string;
  }[];
}

export default function Page() {
  const queryClient = useQueryClient();

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      default_servings: "",
      mins_prep: "",
      mins_cook: "",
      procedure: "",
      tags: [{ key: "", value: "" }],
      ingredients: [{ quantity: "", unit: "", name: "", storage: "FRIDGE" }],
    },
    // defaultValues: {
    //   value1: [{ email: "Bill", password: "Luo" }],
    // },
  });
  // const name = watch("name");
  // console.log("name: ", name);

  const {
    fields: fields1,
    append: append1,
    remove: remove1,
  } = useFieldArray({
    name: "tags",
    control, // control props comes from useForm (optional: if you are using FormContext)
  });
  const {
    fields: fields2,
    append: append2,
    remove: remove2,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ingredients", // unique name for your Field Array
  });
  async function postData(data) {
    axios
      .post("https://open-recipes.onrender.com/recipes", data)
      .then(function (response) {
        console.log(response, null, 2);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const requireIntegerInput = (newValue, onChange) => {
    // Use parseInt to convert the string to an integer
    const integerValue = parseInt(newValue, 10);

    // Check if the parsed value is a valid integer
    if (!isNaN(integerValue) || newValue === "") {
      onChange(integerValue);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const newData = data;
    newData.created_at = Date().toLocaleString();
    console.log("Form Data: ", JSON.stringify(newData));
    const formattedData = {
      ...newData,
      default_servings: parseInt(data.default_servings),
      mins_prep: parseInt(data.mins_prep),
      mins_cook: parseInt(data.mins_cook),
      author_id: null,
      ingredients: data.ingredients.map((ingredient) => {
        return {
          ...ingredient,
          quantity: 1, //FIXME
          storage: "FRIDGE",
        };
      }),
    };
    const fakeData = {
      "name": "Coffee Recipe",
      "mins_prep": 0,
      "mins_cook": 0,
      "description": "string",
      "default_servings": 0,
      "procedure": "string",
      "created_at": "string",
      "author_id": null,
      "tags": [
        {
          "key": "Cusine",
          "value": "Italian"
        }
      ],
      "ingredients": [
        {
          "name": "ICED COFFEE",
          "storage": "FRIDGE",
          "quantity": 1,
          "unit": "cup"
        }
      ]};
    

    console.log(formattedData);
    postData(formattedData);

    //  axios.post("https://open-recipes.onrender.com/recipes", JSON.stringify(data), {
    //   headers: {
    // 'Content-Type': 'application/json'
    //   }
    // })
    //  .then(res => {console.log('Response: ', res.data)})
    //  .catch(error => {console.error('Error: ', error)})
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContent}>
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["name"] ? styles.error : styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          rules={{ required: true }}
        />

        <Text style={styles.label}>Description</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["description"] ? styles.error : styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="description"
          rules={{ required: true }}
        />
        <Text style={styles.label}>Servings</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["default_servings"] ? styles.error : styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
              keyboardType="numeric"
            />
          )}
          name="default_servings"
          rules={{ required: true }}
        />

        <Text style={styles.label}>Time</Text>
        <View style={styles.ingredient}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={`Prep Time`}
                placeholderTextColor={"gray"}
                style={errors["mins_prep"] ? styles.error : styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                keyboardType="numeric"
              />
            )}
            name="mins_prep"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={`Cook Time`}
                placeholderTextColor={"gray"}
                style={errors["mins_cook"] ? styles.error : styles.input}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                keyboardType="numeric"
              />
            )}
            name="mins_cook"
            rules={{ required: true }}
          />
        </View>

        <Text style={styles.label}>Tags</Text>
        {fields1.map((field, index) => (
          <View key={field.id} style={styles.container}>
            <View style={styles.ingredient}>
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["tags"]?.[index]?.["key"]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Key`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`tags.${index}.key` as keyof FormValues}
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["tags"]?.[index]?.["value"]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Value`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`tags.${index}.value` as keyof FormValues}
                rules={{ required: true }}
                defaultValue=""
              />

              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
                    remove1(index);
                  }}
                  title="Remove"
                  color="white"
                />
              </View>
            </View>
          </View>
        ))}
        <View style={styles.smallButton}>
          <Button
            title="Add Tag"
            color="white"
            onPress={() => {
              append1({ key: "", value: "" });
            }}
          />
        </View>

        <Text style={styles.label}>Ingredients</Text>
        {fields2.map((field, index) => (
          <View key={field.id} style={styles.container}>
            <View style={styles.ingredient}>
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["ingredients"]?.[index]?.["quantity"]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Quantity`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.quantity` as keyof FormValues}
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["ingredients"]?.[index]?.["unit"]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Unit`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.unit` as keyof FormValues}
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({ field }) => (
                  <TextInput
                    style={
                      errors["ingredients"]?.[index]?.["name"]
                        ? styles.error
                        : styles.input
                    }
                    placeholder={`Ingredient`}
                    placeholderTextColor={"gray"}
                    onChangeText={field.onChange}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                )}
                name={`ingredients.${index}.name` as keyof FormValues}
                rules={{ required: true }}
              />
              <View style={styles.smallButton}>
                <Button
                  onPress={() => {
                    remove2(index);
                  }}
                  title="Remove"
                  color="white"
                />
              </View>
            </View>
          </View>
        ))}

        <View style={styles.smallButton}>
          <Button
            title="Add Ingredient"
            color="white"
            onPress={() => {
              append2({
                quantity: "",
                unit: "",
                name: "",
                storage: "FRIDGE",
              });
            }}
          />
        </View>
        <Text style={styles.label}>Instructions</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={errors["procedure"] ? styles.error : styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="procedure"
          rules={{ required: true }}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Cancel"
          color="red"
          onPress={() => {
            reset({
              name: "",
              description: "",
              default_servings: "",
              mins_prep: "",
              mins_cook: "",
              procedure: "",
              tags: [{ key: "", value: "" }],
              ingredients: [{ quantity: "", unit: "", name: "", storage: "" }],
            });
          }}
        />
        <Button
          title="Fill Form - Test"
          color="blue"
          onPress={() => {
            reset({
              name: "Coffee Recipe",
              mins_prep: "0",
              mins_cook: "0",
              description: "string",
              default_servings: "0",
              procedure: "string",
              created_at: "string",
              author_id: "",
              tags: [
                {
                  key: "Cusine",
                  value: "Italian",
                },
              ],
              ingredients: [
                {
                  name: "ICED COFFEE",
                  storage: "FRIDGE",
                  quantity: "1",
                  unit: "cup",
                },
              ],
            });
          }}
        />
        <Button
          title="Create"
          color="green"
          onPress={() => {
            handleSubmit(onSubmit)();
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  label: {
    color: "white",
    margin: 20,
    marginLeft: 0,
  },
  footer: {
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "gray",
    borderRadius: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ingredient: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    margin: 0,
    padding: 0,
  },
  smallButton: {
    marginTop: 0,
    color: "white",
    height: 40,
    backgroundColor: "gray",
    borderRadius: 4,
    justifyContent: "flex-end",
    flex: 0,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
    padding: 8,
    backgroundColor: "gray",
  },
  input: {
    backgroundColor: "white",
    height: 40,
    borderRadius: 4,
    padding: 10,
  },
  error: {
    borderColor: "red",
    borderWidth: 1,
    backgroundColor: "white",
    height: 40,
    borderRadius: 4,
    padding: 10,
  },
});
