## Apex X

X is a generic(ish) fluent collection library for Apex. Simple list comprehension functions like filter, map, reduce, etc. are possible in a single statement, reducing tons of code.

{% include_relative generate.html %}

### Installation

Create classes `X` and `X_Tests`, and copy the code in.

### Usage

```apex

Lead[] leads = [ SELECT Id, Email FROM Lead ];
Contact[] contacts = [SELECT Id, Email FROM Contact ];

// Get all distinct emails from the leads.
String[] leadEmails = X.of(leads) // Returns X.OfSObject
    .pluckString('Email')         // Returns X.OfString with the values of Email
    .notNull()                    // Filters out values that are null
    .distinct()                   // Filters out duplicates
    .toList();                    // Convert back to a native list.

// Get all distinct emails from contacts.
String[] contactEmails = X.of(contacts).pluckString('Email').notNull().distinct().toList();

// Combine the lists of emails
String[] distinctEmails = X.of(leadEmails) // Returns X.OfString
    .concat(contactEmails)                 // Returns a new X.OfString without modifying prior collections
    .dictinct()                            // Filter out duplicates
    .toList();                             // Convert back to native list.

```

### Operators

```
For X where X.Of<Type>:

.add(Value value):void                          # Append value to X.
.addAll(X|List<Type>|Set<Type> other):void      # Appends values to X.
.remove(Value value):void                       # Removed any matching value from X.
.without(Value value):X                         # Returns a new X without any matching value.
.get(Integer index):Value                       # Returns value at index, or null if out of range.
.slice(Integer begin[, Integer end]):X          # Returns subset of X.
.size():Integer                                 # Returns size of collection.
.distinct():X                                   # Filters out duplicates.
.notNull():X                                    # Filters out nulls.
.first():Value                                  # Returns first element, or null if empty.
.last():Value                                   # Returns last element, or null if empty.
.join([String separator]):String                # Combines all elements into a string.
.union(X|List other):X                          # Returns new collection with all values from both.
.filter(TypePredicate predicate):X              # Filter selection based on predicate function.
.mapTo(TypeMapper|TypeSelector mapper):XOfType  # Returns new collection of values selected by function.
.reduce(TypeReducer reducer):Value              # Returns single value reduced by function.

For X.OfSObject, and Type is a primitive (String, Integer, etc.)

.pluckType(String|SObjectField field):XType
.groupBy(TypeSelector selector):Map<Type, SObject[]>
.groupByType(String|SObjectField field):Map<Type, SObject[]>
.toMap(TypeSelector selector):Map<Type, SObject>
.toMapByType(String|SObjectField field):Map<Type, SObject>
.havingType(String|SObjectField field):XType                 # Filter where field isn't null
.havingType(String|SObjectField field, Type value):XType     # Filter based on field matching
.notHavingType(String|SObjectField field):XType              # Filter where field is null
.notHavingType(String|SObjectField field, Type value):XType  # Filter based on field not matching
```

