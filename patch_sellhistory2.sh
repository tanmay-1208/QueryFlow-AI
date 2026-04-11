sed -i '' '/private Long customerId;/a\
\
    @Enumerated(EnumType.STRING)\
    @Column(name = "price_group")\
    private PriceGroup priceGroup;\
' src/main/java/com/example/demo/SellHistory.java
