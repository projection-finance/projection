import React from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";


export default function AutoCompleteComp(){
    
return 
    (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setValue({
                  name: newValue,
                });
                addQuantity(newValue);
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setValue({
                  name: newValue.inputValue,
                });
                addQuantity({ name: newValue.inputValue, symbol: "" });
              } else {
                setValue(newValue);
                if (newValue) addQuantity(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const { inputValue } = params;
              if (inputValue.length === 0) return [];
              const filtered = options.filter(
                (item) =>
                  item.name.toLowerCase().startsWith(inputValue) ||
                  item.symbol.toLowerCase().startsWith(inputValue)
              );

              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.name
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  name: `Add "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={coins}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            sx={{ width: "100%" }}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Assets" />}
          />
          {showQt ? (
            <div className={styles["div-flex"]}>
              <InputLabel htmlFor="component-helper">Amount</InputLabel>

              <Input
                type="text"
                value={qt}
                placeholder="Amount"
                onChange={handleQtChange}
              />
              <InputLabel htmlFor="component-helper">Current price</InputLabel>

              <Input
                type="text"
                placeholder="Current price"
                value={currentPrice}
                onChange={handleCpChange}
              />

              <Button variant="contained" onClick={handelAfterAddQ}>
                add coin
              </Button>
            </div>
          ) : (
            ""
          )}
)
}