import React from "react";
export function StoreProductsPage() {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
      }}
    >
      <div style={{ width: "15%" }}>
        <AutocompleteTextField
          options={UPCs}
          onChange={handleOnChangeUPC}
          label="UPC"
        />
      </div>

      <div
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "inline-block",
          width: "50%",
          borderLeft: "1px solid grey",
          paddingLeft: "15px",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            height: "80px",
            gap: "30px",
          }}
        >
          <AutocompleteTextField
            label="Чи акційний товар"
            options={isPromotionalOptions}
            onChange={handleOnChangeIsPromotional}
            style={{ width: "200px" }}
            defaultValue={isPromotionalOptions[0]}
          />
          <AutocompleteTextField
            label="Сортування"
            options={sortingStoreProductsOptions}
            onChange={handleOnChangeSortingStoreProducts}
            style={{ width: "250px" }}
            defaultValue={sortingStoreProductsOptions[0]}
          />
        </div>

        <div
          style={{
            width: "80%",
          }}
        >
          {selectedUPC !== "" && (
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                gap: "15px",
                width: "100vh",
              }}
            >
              <TovarCard
                tovarName="Крупа гречана 'Геркулес' 500г"
                price="50.00"
                amount="40"
                unitOfMeasurement="шт."
              />
              <div
                style={{
                  width: "700px",
                  marginTop: "10px",
                  marginLeft: "40px",
                }}
              >
                <label style={{ marginBottom: "10px" }}>
                  Кількість проданих одиниць товару: {soldProductsAmount}
                </label>

                <DateInput
                  dateRange={tovarDateRange}
                  setDateRange={setTovarDateRange}
                />
              </div>
            </div>
          )}

          {selectedUPC === "" && (
            <TableObject
              columnNames={storeProductsColumnNames}
              service={storeProductsService}
              updater={updater}
            />
          )}
        </div>
      </div>
    </div>
  );
}
